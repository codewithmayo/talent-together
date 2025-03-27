"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Database } from "@/types/supabase"

type CampaignWithProfile = Database["public"]["Tables"]["campaigns"]["Row"] & {
  profiles?: {
    name: string
  }
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<CampaignWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState<"brand" | "creator" | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        navigate("/login")
        return
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("type")
        .eq("id", sessionData.session.user.id)
        .single()

      if (!profileData) {
        navigate("/")
        return
      }

      setUserType(profileData.type as "brand" | "creator")
      setUserId(sessionData.session.user.id)
      fetchCampaigns(sessionData.session.user.id, profileData.type)
    } catch (error) {
      console.error("Error checking user:", error)
      toast.error("Failed to load user data")
      navigate("/login")
    }
  }

  const fetchCampaigns = async (userId: string, type: string) => {
    try {
      const query = supabase
        .from("campaigns")
        .select(`
          *,
          profiles:brand_id (
            name
          )
        `)
        .order("created_at", { ascending: false })

      // For brands, only show their own campaigns
      // For creators, show all active campaigns
      const { data, error } = await (type === "brand" ? query.eq("brand_id", userId) : query.eq("status", "active"))

      if (error) throw error

      const campaignsData = (data || []) as unknown as CampaignWithProfile[]
      setCampaigns(campaignsData)
    } catch (error) {
      console.error("Error fetching campaigns:", error)
      toast.error("Failed to load campaigns")
    } finally {
      setLoading(false)
    }
  }

  const updateCampaignStatus = async (campaignId: string, newStatus: string) => {
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .update({ status: newStatus })
        .eq("id", campaignId)
        .select(`
          *,
          profiles:brand_id (
            name
          )
        `)

      if (error) throw error

      // Update local state with the returned data
      if (data && data[0]) {
        setCampaigns(campaigns.map((campaign) => (campaign.id === campaignId ? { ...campaign, ...data[0] } : campaign)))
        toast.success("Campaign status updated")
      }
    } catch (error) {
      console.error("Error updating campaign status:", error)
      toast.error("Failed to update campaign status")
    }
  }

  const deleteCampaign = async (id: string) => {
    try {
      const { error } = await supabase.from("campaigns").delete().eq("id", id)

      if (error) throw error

      setCampaigns(campaigns.filter((campaign) => campaign.id !== id))
      toast.success("Campaign deleted successfully")
    } catch (error) {
      console.error("Error deleting campaign:", error)
      toast.error("Failed to delete campaign")
    }
  }

  const getBudgetDisplay = (campaign: CampaignWithProfile) => {
    if (campaign.budget_range) {
      return campaign.budget_range
    } else if (campaign.min_budget || campaign.max_budget) {
      if (campaign.min_budget && campaign.max_budget) {
        return `$${campaign.min_budget.toLocaleString()} - $${campaign.max_budget.toLocaleString()}`
      } else if (campaign.min_budget) {
        return `From $${campaign.min_budget.toLocaleString()}`
      } else if (campaign.max_budget) {
        return `Up to $${campaign.max_budget.toLocaleString()}`
      }
    }
    return "Not specified"
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{userType === "brand" ? "My Campaigns" : "Available Campaigns"}</h1>
            <p className="text-muted-foreground mt-1">
              {userType === "brand"
                ? "Manage your campaign listings and track their status"
                : "Browse and find campaigns to collaborate with brands"}
            </p>
          </div>
          {userType === "brand" && (
            <Button onClick={() => navigate("/campaigns/new")}>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">
                {userType === "brand"
                  ? "You haven't created any campaigns yet."
                  : "No active campaigns available at the moment."}
              </p>
              {userType === "brand" && (
                <Button onClick={() => navigate("/campaigns/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Campaign
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className={`
                  ${campaign.brand_id === userId ? "border-primary" : ""}
                  ${campaign.status !== "active" ? "opacity-75" : ""}
                `}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="mb-2">{campaign.title}</CardTitle>
                      <CardDescription>{campaign.profiles?.name || "Unknown Brand"}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {campaign.brand_id === userId && (
                        <>
                          <Select
                            value={campaign.status}
                            onValueChange={(value) => updateCampaignStatus(campaign.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="paused">Paused</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/campaigns/edit/${campaign.id}`)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this campaign? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteCampaign(campaign.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                    {campaign.content_type?.map((type) => (
                      <Badge key={type} variant="outline">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm line-clamp-3">{campaign.description}</p>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/campaigns/${campaign.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

