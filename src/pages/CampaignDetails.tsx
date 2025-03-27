"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import {
  Users,
  Mail,
  Globe,
  Hash,
  Calendar,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  ArrowLeft,
  DollarSign,
  UserCheck,
} from "lucide-react"
import type { Campaign } from "@/types/campaign"

export default function CampaignDetails(): JSX.Element {
  const { id } = useParams()
  const navigate = useNavigate()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCampaign()
  }, [id])

  const fetchCampaign = async () => {
    try {
      const { data: campaignData, error: campaignError } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single()

      if (campaignError) throw campaignError

      const { data: brandData, error: brandError } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .eq("id", campaignData.brand_id)
        .single()

      if (brandError) throw brandError

      // Log the campaign data to see what's available
      console.log("Campaign data:", campaignData)

      // Safely handle the campaign data
      setCampaign({
        ...campaignData,
        brand: brandData,
        content_type: campaignData.content_type || [],
        preferred_niches: campaignData.preferred_niches || [],
        preferred_platforms: campaignData.preferred_platforms || [],
        geographic_targeting: campaignData.geographic_targeting || [],
        hashtags: campaignData.hashtags || [],
        contact_info: campaignData.contact_info || {},
        // Ensure preferred_gender is properly set
        preferred_gender: campaignData.preferred_gender || [],
      })
    } catch (error) {
      console.error("Error fetching campaign:", error)
      toast.error("Failed to load campaign details")
      navigate("/brand-campaigns")
    } finally {
      setLoading(false)
    }
  }

  // Safe getter for status badge
  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      paused: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    }

    return (
      <Badge className={statusColors[status] || ""} variant="outline">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  // Helper function to display preferred gender
  const renderPreferredGender = () => {
    // Check if preferred_gender exists in any form
    if (!campaign) return null

    // Try different ways the data might be structured
    let genderData = campaign.preferred_gender

    // If it's a string, convert to array
    if (typeof genderData === "string") {
      try {
        // It might be a JSON string
        genderData = JSON.parse(genderData)
      } catch (e) {
        // If not JSON, make it a single-item array
        genderData = [genderData]
      }
    }

    // If it's not an array by now, try to handle other cases
    if (!Array.isArray(genderData)) {
      // If it's an object with values
      if (genderData && typeof genderData === "object") {
        genderData = Object.values(genderData)
      } else {
        // If we can't determine the structure, return null
        return null
      }
    }

    // If we have an empty array, return null
    if (!genderData.length) return null

    return (
      <div>
        <h3 className="font-semibold mb-2">Preferred Gender</h3>
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-primary" />
          <div className="flex flex-wrap gap-2">
            {genderData.map((gender, index) => (
              <Badge key={index} variant="outline">
                {gender}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!campaign) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Campaign Not Found</h2>
            <p className="text-gray-600 mb-8">The campaign you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate("/brand-campaigns")}>Back to Campaigns</Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => navigate("/brand-campaigns")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Button>

        <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl mb-8 border">
          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
            {campaign.brand.avatar_url && (
              <img
                src={campaign.brand.avatar_url || "/placeholder.svg"}
                alt={campaign.brand.name}
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
              />
            )}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{campaign.title}</h1>
                  <p className="text-gray-600">by {campaign.brand.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(campaign.status)}
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {campaign.payment_type}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Budget Range</p>
                <p className="font-medium">{campaign.budget_range}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Follower Range</p>
                <p className="font-medium">{campaign.follower_range}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-gray-500">Campaign Duration</p>
                <p className="font-medium">
                  {new Date(campaign.start_date).toLocaleDateString()} -{" "}
                  {new Date(campaign.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b">
                <CardTitle>Campaign Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h3 className="font-semibold mb-2 text-lg">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{campaign.description}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2 text-lg">Requirements</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{campaign.requirements}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2 text-lg">Content Type</h3>
                  <div className="flex flex-wrap gap-2">
                    {campaign.content_type.map((type) => (
                      <Badge key={type} variant="secondary">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b">
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h3 className="font-semibold mb-2 text-lg">Usage Rights</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{campaign.usage_rights}</p>
                </div>

                {campaign.past_collaborations && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">Past Collaborations</h3>
                      <p className="text-gray-600 whitespace-pre-wrap">{campaign.past_collaborations}</p>
                    </div>
                  </>
                )}

                {campaign.hashtags && campaign.hashtags.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">Required Hashtags</h3>
                      <div className="flex flex-wrap gap-2">
                        {campaign.hashtags.map((hashtag) => (
                          <Badge key={hashtag} variant="secondary">
                            <Hash className="h-3 w-3 mr-1" />
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {campaign.extra_notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">Extra Notes</h3>
                      <p className="text-gray-600 whitespace-pre-wrap">{campaign.extra_notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b">
                <CardTitle>Creator Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Use the helper function to render preferred gender */}
                {renderPreferredGender()}

                <div>
                  <h3 className="font-semibold mb-2">Preferred Niches</h3>
                  <div className="flex flex-wrap gap-2">
                    {campaign.preferred_niches.map((niche) => (
                      <Badge key={niche} variant="outline">
                        {niche}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Preferred Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {campaign.preferred_platforms.map((platform) => (
                      <Badge key={platform} variant="outline">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Minimum Engagement Rate</h3>
                  <div className="flex items-center gap-2">
                    <span>{campaign.min_engagement_rate}%</span>
                  </div>
                </div>

                {campaign.geographic_targeting && campaign.geographic_targeting.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Geographic Targeting</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex flex-wrap gap-2">
                        {campaign.geographic_targeting.map((location) => (
                          <Badge key={location} variant="outline">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b">
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {campaign.contact_info?.email && (
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <div className="flex items-center text-gray-600">
                      <Mail className="h-4 w-4 mr-2 text-primary" />
                      <a href={`mailto:${campaign.contact_info.email}`} className="text-primary hover:underline">
                        {campaign.contact_info.email}
                      </a>
                    </div>
                  </div>
                )}

                {campaign.contact_info?.social_links && campaign.contact_info.social_links.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Social Media Links</h3>
                    <div className="flex flex-wrap gap-4">
                      {campaign.contact_info.social_links.map((link, index) => {
                        // Safely handle URL parsing
                        let hostname = ""
                        try {
                          hostname = new URL(link).hostname.replace("www.", "")
                        } catch (e) {
                          hostname = link
                        }

                        return (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-gray-600 hover:text-primary transition-colors"
                          >
                            {link.includes("instagram.com") && <Instagram className="h-4 w-4 mr-2 text-primary" />}
                            {link.includes("twitter.com") && <Twitter className="h-4 w-4 mr-2 text-primary" />}
                            {link.includes("facebook.com") && <Facebook className="h-4 w-4 mr-2 text-primary" />}
                            {link.includes("linkedin.com") && <Linkedin className="h-4 w-4 mr-2 text-primary" />}
                            {link.includes("youtube.com") && <Youtube className="h-4 w-4 mr-2 text-primary" />}
                            {!link.includes("instagram.com") &&
                              !link.includes("twitter.com") &&
                              !link.includes("facebook.com") &&
                              !link.includes("linkedin.com") &&
                              !link.includes("youtube.com") && <Globe className="h-4 w-4 mr-2 text-primary" />}
                            {hostname}
                          </a>
                        )
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

