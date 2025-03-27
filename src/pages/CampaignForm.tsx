"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { supabase } from "@/integrations/supabase/client"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { contentTypes, niches, platforms, regions, followerRanges } from "@/lib/constants"
import { CalendarIcon } from "lucide-react"
import type { Database } from "@/types/supabase"

type Campaign = Database["public"]["Tables"]["campaigns"]["Row"]
type FormData = Omit<Campaign, "id" | "created_at" | "updated_at"> & {
  preferred_gender?: "male" | "female" | "any" | "open to all"
}

export default function CampaignForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [contentTypeOptions, setContentTypeOptions] = useState<string[]>([])
  const [nicheOptions, setNicheOptions] = useState<string[]>([])
  const [platformOptions, setPlatformOptions] = useState<string[]>([])
  const [regionOptions, setRegionOptions] = useState<string[]>([])
  const [brandId, setBrandId] = useState<string | null>(null)
  const [socialLinks, setSocialLinks] = useState<string[]>([""])
  const [activeTab, setActiveTab] = useState("basic")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>()

  useEffect(() => {
    checkUser()
    if (id) {
      fetchCampaign()
    } else {
      setInitialLoading(false)
    }
    // Initialize options
    setContentTypeOptions(contentTypes)
    setNicheOptions(niches)
    setPlatformOptions(platforms)
    setRegionOptions(regions)
  }, [id])

  const checkUser = async () => {
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

    if (!profileData || profileData.type !== "brand") {
      navigate("/")
      toast.error("Only brands can create campaigns")
      return
    }

    setBrandId(sessionData.session.user.id)
  }

  const fetchCampaign = async () => {
    try {
      const { data: campaign, error } = await supabase.from("campaigns").select("*").eq("id", id).single()

      if (error) throw error

      if (campaign) {
        Object.entries(campaign).forEach(([key, value]) => {
          setValue(key as keyof FormData, value)
        })
      }
    } catch (error) {
      console.error("Error fetching campaign:", error)
      toast.error("Failed to load campaign")
      navigate("/campaigns")
    } finally {
      setInitialLoading(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      if (!brandId) {
        toast.error("Not authorized")
        return
      }

      // Prepare social links
      const filteredSocialLinks = socialLinks.filter((link) => link.trim() !== "")
      const contactInfo = {
        ...data.contact_info,
        social_links: filteredSocialLinks,
      }

      const campaignData = {
        ...data,
        brand_id: brandId,
        status: data.status || "draft",
        contact_info: contactInfo,
      }

      if (id) {
        const { error } = await supabase.from("campaigns").update(campaignData).eq("id", id)

        if (error) throw error
        toast.success("Campaign updated successfully")
      } else {
        const { error } = await supabase.from("campaigns").insert([campaignData])

        if (error) throw error
        toast.success("Campaign created successfully")
      }

      navigate("/campaigns")
    } catch (error) {
      console.error("Error saving campaign:", error)
      toast.error("Failed to save campaign")
    } finally {
      setLoading(false)
    }
  }

  const handleContentTypeChange = (type: string) => {
    const currentTypes = watch("content_type") || []
    const newTypes = currentTypes.includes(type) ? currentTypes.filter((t) => t !== type) : [...currentTypes, type]
    setValue("content_type", newTypes)
  }

  const handleNicheChange = (niche: string) => {
    const currentNiches = watch("preferred_niches") || []
    const newNiches = currentNiches.includes(niche)
      ? currentNiches.filter((n) => n !== niche)
      : [...currentNiches, niche]
    setValue("preferred_niches", newNiches)
  }

  const handlePlatformChange = (platform: string) => {
    const currentPlatforms = watch("preferred_platforms") || []
    const newPlatforms = currentPlatforms.includes(platform)
      ? currentPlatforms.filter((p) => p !== platform)
      : [...currentPlatforms, platform]
    setValue("preferred_platforms", newPlatforms)
  }

  const handleRegionChange = (region: string) => {
    const currentRegions = watch("geographic_targeting") || []
    const newRegions = currentRegions.includes(region)
      ? currentRegions.filter((r) => r !== region)
      : [...currentRegions, region]
    setValue("geographic_targeting", newRegions)
  }

  if (initialLoading) {
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

  return (
    <>
      <Navigation />
      <main className="container max-w-5xl mx-auto px-4 py-8">
        <Card className="border-2 shadow-md">
          <CardHeader className="bg-muted/50">
            <CardTitle className="text-2xl font-bold">{id ? "Edit Campaign" : "Create Campaign"}</CardTitle>
            <CardDescription>
              {id
                ? "Update your campaign details to attract the right creators"
                : "Fill in the details to create a new campaign and find the perfect creators"}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1">
                  <TabsTrigger value="basic" className="text-sm">
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="requirements" className="text-sm">
                    Creator Requirements
                  </TabsTrigger>
                  <TabsTrigger value="budget" className="text-sm">
                    Budget & Timeline
                  </TabsTrigger>
                  <TabsTrigger value="additional" className="text-sm">
                    Additional Details
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-base font-medium">
                        Campaign Title <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        {...register("title", { required: true })}
                        placeholder="Enter a catchy campaign title"
                        className="h-11"
                      />
                      {errors.title && <p className="text-sm text-destructive">Campaign title is required</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-base font-medium">
                        Campaign Description <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="description"
                        {...register("description", { required: true })}
                        placeholder="Describe your campaign in detail - what are you looking to achieve?"
                        className="min-h-[150px] resize-y"
                      />
                      {errors.description && <p className="text-sm text-destructive">Description is required</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium">Content Types</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {contentTypeOptions.map((type) => (
                          <Badge
                            key={type}
                            variant={watch("content_type")?.includes(type) ? "default" : "outline"}
                            className="cursor-pointer px-3 py-1 text-sm"
                            onClick={() => handleContentTypeChange(type)}
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="requirements" className="text-base font-medium">
                        Campaign Requirements
                      </Label>
                      <Textarea
                        id="requirements"
                        {...register("requirements")}
                        placeholder="List specific requirements for creators (e.g., deliverables, deadlines, etc.)"
                        className="min-h-[120px] resize-y"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="requirements" className="space-y-6">
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Preferred Creator Niches</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {nicheOptions.map((niche) => (
                          <Badge
                            key={niche}
                            variant={watch("preferred_niches")?.includes(niche) ? "default" : "outline"}
                            className="cursor-pointer px-3 py-1 text-sm"
                            onClick={() => handleNicheChange(niche)}
                          >
                            {niche}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium">Preferred Platforms</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {platformOptions.map((platform) => (
                          <Badge
                            key={platform}
                            variant={watch("preferred_platforms")?.includes(platform) ? "default" : "outline"}
                            className="cursor-pointer px-3 py-1 text-sm"
                            onClick={() => handlePlatformChange(platform)}
                          >
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium">Geographic Targeting</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {regionOptions.map((region) => (
                          <Badge
                            key={region}
                            variant={watch("geographic_targeting")?.includes(region) ? "default" : "outline"}
                            className="cursor-pointer px-3 py-1 text-sm"
                            onClick={() => handleRegionChange(region)}
                          >
                            {region}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferred_gender" className="text-base font-medium">
                        Preferred Creator Gender
                      </Label>
                      <Select
                        value={watch("preferred_gender")}
                        onValueChange={(value) =>
                          setValue("preferred_gender", value as "male" | "female" | "any" | "open to all")
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select preferred gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="any">Any</SelectItem>
                          <SelectItem value="open to all">Open to All</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="follower_range" className="text-base font-medium">
                        Required Follower Range
                      </Label>
                      <Select
                        value={watch("follower_range")}
                        onValueChange={(value) => setValue("follower_range", value)}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select follower range" />
                        </SelectTrigger>
                        <SelectContent>
                          {followerRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="min_engagement_rate" className="text-base font-medium">
                        Minimum Engagement Rate (%)
                      </Label>
                      <div className="relative">
                        <Input
                          id="min_engagement_rate"
                          type="number"
                          step="0.1"
                          min="0"
                          max="100"
                          {...register("min_engagement_rate")}
                          placeholder="e.g., 2.5"
                          className="h-11 pl-8"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-muted-foreground">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="budget" className="space-y-6">
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="payment_type" className="text-base font-medium">
                        Payment Type
                      </Label>
                      <Select value={watch("payment_type")} onValueChange={(value) => setValue("payment_type", value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select payment type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Rate</SelectItem>
                          <SelectItem value="negotiable">Negotiable</SelectItem>
                          <SelectItem value="performance">Performance Based</SelectItem>
                          <SelectItem value="product">Product Exchange</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget_range" className="text-base font-medium">
                        Budget Range
                      </Label>
                      <Select value={watch("budget_range")} onValueChange={(value) => setValue("budget_range", value)}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="$100-$500">$100-$500</SelectItem>
                          <SelectItem value="$500-$1000">$500-$1000</SelectItem>
                          <SelectItem value="$1000-$5000">$1000-$5000</SelectItem>
                          <SelectItem value="$5000+">$5000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="start_date" className="text-base font-medium">
                          Start Date
                        </Label>
                        <div className="relative">
                          <Input id="start_date" type="date" {...register("start_date")} className="h-11 pl-10" />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="end_date" className="text-base font-medium">
                          End Date
                        </Label>
                        <div className="relative">
                          <Input id="end_date" type="date" {...register("end_date")} className="h-11 pl-10" />
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="additional" className="space-y-6">
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contact_info.email" className="text-base font-medium">
                        Contact Email
                      </Label>
                      <Input
                        id="contact_info.email"
                        type="email"
                        {...register("contact_info.email")}
                        placeholder="Enter contact email"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base font-medium">Social Links</Label>
                      {socialLinks.map((link, index) => (
                        <div key={index} className="flex gap-2 mt-2">
                          <Input
                            value={link}
                            onChange={(e) => {
                              const newLinks = [...socialLinks]
                              newLinks[index] = e.target.value
                              setSocialLinks(newLinks)
                            }}
                            placeholder="Enter social media link"
                            className="h-11"
                          />
                          {index === socialLinks.length - 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setSocialLinks([...socialLinks, ""])}
                              className="shrink-0"
                            >
                              Add
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="usage_rights" className="text-base font-medium">
                        Usage Rights
                      </Label>
                      <Textarea
                        id="usage_rights"
                        {...register("usage_rights")}
                        placeholder="Specify usage rights and terms"
                        className="min-h-[100px] resize-y"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="past_collaborations" className="text-base font-medium">
                        Past Collaborations
                      </Label>
                      <Textarea
                        id="past_collaborations"
                        {...register("past_collaborations")}
                        placeholder="List any relevant past collaborations"
                        className="min-h-[100px] resize-y"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="extra_notes" className="text-base font-medium">
                        Extra Notes
                      </Label>
                      <Textarea
                        id="extra_notes"
                        {...register("extra_notes")}
                        placeholder="Any additional information"
                        className="min-h-[100px] resize-y"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => navigate("/campaigns")}>
                  Cancel
                </Button>
                <div className="flex gap-2">
                  {activeTab !== "basic" && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const tabs = ["basic", "requirements", "budget", "additional"]
                        const currentIndex = tabs.indexOf(activeTab)
                        if (currentIndex > 0) {
                          setActiveTab(tabs[currentIndex - 1])
                        }
                      }}
                    >
                      Previous
                    </Button>
                  )}

                  {activeTab !== "additional" ? (
                    <Button
                      type="button"
                      onClick={() => {
                        const tabs = ["basic", "requirements", "budget", "additional"]
                        const currentIndex = tabs.indexOf(activeTab)
                        if (currentIndex < tabs.length - 1) {
                          setActiveTab(tabs[currentIndex + 1])
                        }
                      }}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={loading} className="min-w-[120px]">
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : id ? (
                        "Update Campaign"
                      ) : (
                        "Create Campaign"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  )
}

