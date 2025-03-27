"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Building2, Users } from "lucide-react"
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

// Custom badge variants
const badgeVariants = {
  success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
}

interface Brand {
  id: string
  name: string
  avatar_url?: string
}

interface Campaign {
  id: string
  brand_id: string
  title: string
  description: string
  requirements: string
  content_type: string[]
  budget_range: string
  min_budget: number
  max_budget: number
  payment_type: string
  preferred_niches: string[]
  preferred_platforms: string[]
  follower_range: string
  min_engagement_rate: number
  geographic_targeting: string[]
  hashtags: string[]
  usage_rights: string
  past_collaborations: string
  extra_notes: string
  contact_info: {
    email?: string
    social_links?: string[]
  }
  status: string
  start_date: string
  end_date: string
  brand: Brand
}

type DatabaseCampaign = Database["public"]["Tables"]["campaigns"]["Row"]
type DatabaseProfile = Database["public"]["Tables"]["profiles"]["Row"]

export default function BrandCampaigns(): JSX.Element {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState<"creator" | "brand" | null>(null)
  const [sortOption, setSortOption] = useState<string>("all")
  const [userId, setUserId] = useState<string | null>(null)
  const isInitialMount = useRef(true)
  const isLoadingRef = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      if (isMounted && !isLoadingRef.current) {
        isLoadingRef.current = true
        await checkUserAndFetchCampaigns()
        isLoadingRef.current = false
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [sortOption])

  const checkUserAndFetchCampaigns = async () => {
    try {
      // Always set loading to true at the start of the fetch
      setLoading(true)

      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        navigate("/login")
        return
      }

      setUserId(sessionData.session.user.id)

      // Get user type
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("type")
        .eq("id", sessionData.session.user.id)
        .single<DatabaseProfile>()

      if (profileError) {
        console.error("Error fetching user profile:", profileError)
        // Silently handle the error without showing a toast
        // Set a default user type to prevent UI issues
        setUserType("creator") // Default to creator view as a fallback
      } else if (profileData && (profileData.type === "creator" || profileData.type === "brand")) {
        setUserType(profileData.type)
      } else {
        // Default to creator if no valid type is found
        setUserType("creator")
      }

      // Determine the user type for query building
      const effectiveUserType = userType || (profileData?.type as "creator" | "brand" | null) || "creator"

      // Fetch campaigns based on user type and sort option
      let query = supabase.from("campaigns").select()

      if (effectiveUserType === "creator") {
        // Creator sees only active campaigns
        query = query.eq("status", "active")
      } else if (effectiveUserType === "brand") {
        if (sortOption === "my") {
          // Brand sees ONLY their own campaigns in "My Campaigns" mode
          query = query.eq("brand_id", sessionData.session.user.id)
        } else {
          // Brand sees all active campaigns EXCEPT their own in other views
          query = query.eq("status", "active").neq("brand_id", sessionData.session.user.id)
        }
      }

      const { data: campaignsData, error: campaignsError } = await query

      if (campaignsError) {
        console.error("Error fetching campaigns:", campaignsError)
        setCampaigns([])
      } else if (!campaignsData || campaignsData.length === 0) {
        // If no campaigns found, that's not an error - just set empty array
        setCampaigns([])
      } else {
        // Fetch brand info for each campaign
        const fetchedCampaigns = await Promise.all(
          campaignsData.map(async (campaign: DatabaseCampaign) => {
            try {
              const { data: brandData, error: brandError } = await supabase
                .from("profiles")
                .select("id, name, avatar_url")
                .eq("id", campaign.brand_id)
                .single<DatabaseProfile>()

              if (brandError) {
                console.error("Error fetching brand:", brandError)
                return null
              }

              return {
                ...campaign,
                brand: brandData,
                content_type: campaign.content_type || [],
                preferred_niches: campaign.preferred_niches || [],
                preferred_platforms: campaign.preferred_platforms || [],
                geographic_targeting: campaign.geographic_targeting || [],
                hashtags: campaign.hashtags || [],
                contact_info: campaign.contact_info || {},
              } as Campaign
            } catch (error) {
              console.error("Error processing campaign:", error)
              return null
            }
          }),
        )

        // Filter out any campaigns where we couldn't fetch brand info
        const sortedCampaigns = fetchedCampaigns.filter((campaign): campaign is Campaign => campaign !== null)

        // Apply sorting based on the selected option
        switch (sortOption) {
          case "highest-paying":
            sortedCampaigns.sort((a, b) => (b.max_budget || 0) - (a.max_budget || 0))
            break
          case "lowest-paying":
            sortedCampaigns.sort((a, b) => (a.min_budget || 0) - (b.min_budget || 0))
            break
          case "newest":
            sortedCampaigns.sort(
              (a, b) => new Date(b.start_date || "").getTime() - new Date(a.start_date || "").getTime(),
            )
            break
          case "oldest":
            sortedCampaigns.sort(
              (a, b) => new Date(a.start_date || "").getTime() - new Date(b.start_date || "").getTime(),
            )
            break
          default:
            // Default sorting (newest first)
            sortedCampaigns.sort(
              (a, b) => new Date(b.start_date || "").getTime() - new Date(a.start_date || "").getTime(),
            )
        }

        setCampaigns(sortedCampaigns)
      }
    } catch (error) {
      console.error("Error in campaign loading process:", error)
      // Set empty campaigns array to show "No Campaigns Found" instead of infinite loading
      setCampaigns([])
    } finally {
      // Always set loading to false at the end, regardless of success or failure
      setLoading(false)
      isInitialMount.current = false
    }
  }

  const updateCampaignStatus = async (campaignId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from("campaigns").update({ status: newStatus }).eq("id", campaignId)

      if (error) throw error

      // Update local state
      setCampaigns(
        campaigns.map((campaign) => (campaign.id === campaignId ? { ...campaign, status: newStatus } : campaign)),
      )

      toast.success("Campaign status updated")
    } catch (error) {
      console.error("Error updating campaign status:", error)
      toast.error("Failed to update campaign status")
    }
  }

  const deleteCampaign = async (campaignId: string) => {
    try {
      const { error } = await supabase.from("campaigns").delete().eq("id", campaignId)

      if (error) throw error

      // Update local state
      setCampaigns(campaigns.filter((campaign) => campaign.id !== campaignId))
      toast.success("Campaign deleted")
    } catch (error) {
      console.error("Error deleting campaign:", error)
      toast.error("Failed to delete campaign")
    }
  }

  const getBudgetDisplay = (campaign: Campaign) => {
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

  const isOwnCampaign = (campaign: Campaign) => {
    return campaign.brand_id === userId
  }

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {userType === "creator" ? "Available Campaigns" : sortOption === "my" ? "My Campaigns" : "All Campaigns"}
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Sort campaigns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  {userType === "brand" && <SelectItem value="my">My Campaigns</SelectItem>}
                  <SelectItem value="highest-paying">Highest Paying</SelectItem>
                  <SelectItem value="lowest-paying">Lowest Paying</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {userType === "brand" && (
              <Button onClick={() => navigate("/campaigns/new")} className="w-full sm:w-auto">
                Create Campaign
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-lg border-2 border-dashed">
            <h2 className="text-2xl font-semibold mb-4">No Campaigns Found</h2>
            <p className="text-gray-600">
              {userType === "brand" && sortOption === "my"
                ? "Create your first campaign to start collaborating with creators."
                : "Check back later for new campaign opportunities."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="flex flex-col hover:shadow-lg transition-shadow duration-300 border-2 overflow-hidden"
              >
                <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b">
                  <div className="flex items-center gap-2 mb-2">
                    {campaign.brand.avatar_url && (
                      <img
                        src={campaign.brand.avatar_url || "/placeholder.svg"}
                        alt={campaign.brand.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg">{campaign.title}</CardTitle>
                      <div className="absolute top-3 right-3">
                        <Badge
                          variant={
                            campaign.status === "active"
                              ? "success"
                              : campaign.status === "paused"
                                ? "warning"
                                : campaign.status === "completed"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription>{campaign.brand.name}</CardDescription>
                    </div>
                  </div>
                  {userType === "brand" && isOwnCampaign(campaign) && (
                    <div className="mt-2">
                      <Select
                        value={campaign.status}
                        onValueChange={(value) => updateCampaignStatus(campaign.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{campaign.description}</p>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {campaign.content_type.map((type) => (
                        <Badge key={type} variant="secondary">
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="h-4 w-4 mr-1" />
                      {getBudgetDisplay(campaign)}
                    </div>
                    {campaign.follower_range && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {campaign.follower_range}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => navigate(`/campaigns/${campaign.id}`)}
                      >
                        View Details
                      </Button>
                      {userType === "brand" && isOwnCampaign(campaign) && (
                        <>
                          <Button variant="outline" onClick={() => navigate(`/campaigns/edit/${campaign.id}`)}>
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive">Delete</Button>
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
                                <AlertDialogAction onClick={() => deleteCampaign(campaign.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

