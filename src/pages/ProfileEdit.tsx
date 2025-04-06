"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  Plus,
  X,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Send,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { creatorCategories, brandCategories } from "@/lib/categories";
import {
  ProfileEngagementStats,
  type EngagementStats,
} from "@/components/profile/ProfileEngagementStats";

const PLATFORMS = [
  "Instagram",
  "TikTok",
  "Twitter",
  "YouTube",
  "Twitch",
  "Facebook",
  "Other",
];

const COLLABORATION_TYPES = [
  "Paid Sponsorships",
  "Affiliate Deals",
  "Product Gifting",
  "Brand Ambassadors",
  "Shoutouts",
  "Long-term Partnerships",
  "Event Appearances",
  "Content Creation",
  "Social Media Takeovers",
];

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  followers_count: z.number().optional(),
  categories: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional(),
  budget_range: z.string().optional(),
  min_budget: z.number().optional(),
  max_budget: z.number().optional(),
  collaboration_types: z.array(z.string()).optional(),
  preferred_creator_niches: z.array(z.string()).optional(),
  partnership_goals: z.string().optional(),
  past_collaborations: z.string().optional(),
  is_public: z.boolean().optional(),
  under_review: z.boolean().optional(),
  gender: z
    .enum(["male", "female", "other", "prefer_not_to_say"])
    .optional()
    .default("prefer_not_to_say"),
  date_of_birth: z.string().optional(),
  preferred_contact: z.enum(["email", "phone"]).optional().default("email"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  contact: z
    .object({
      email: z.string().email("Invalid email address").optional(),
      phone: z.string().optional(),
      preferred_contact: z.enum(["email", "phone"]).default("email"),
    })
    .optional(),
  engagement_stats: z
    .object({
      likes: z.array(z.number()).length(3).optional(),
      comments: z.array(z.number()).length(3).optional(),
      analyticsImage: z.string().optional(),
      hideAnalytics: z.boolean().optional(),
    })
    .optional(),
});

type SocialLink = {
  platform: string;
  url: string;
  followers: number;
};

type UserProfile = {
  id: string;
  type: "creator" | "brand";
  name: string;
  bio?: string;
  location?: string;
  website?: string;
  followers_count?: number;
  categories?: string[];
  platforms?: string[];
  budget_range?: string;
  min_budget?: number;
  max_budget?: number;
  collaboration_types?: string[];
  preferred_creator_niches?: string[];
  partnership_goals?: string;
  past_collaborations?: string;
  is_public?: boolean;
  under_review?: boolean;
  social_links?: SocialLink[];
  avatar_url?: string;
  email?: string;
  phone?: string;
  preferred_contact?: "email" | "phone";
  created_at?: string;
  updated_at?: string;
  engagement_stats?: EngagementStats;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  date_of_birth?: string;
};

const budgetRangeOptions = [
  "Under $100",
  "$100 - $500",
  "$500 - $1,000",
  "$1,000 - $5,000",
  "$5,000+",
];

const ProfileEdit = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      bio: "",
      location: "",
      website: "",
      followers_count: 0,
      categories: [],
      platforms: [],
      budget_range: "",
      min_budget: 0,
      max_budget: 0,
      collaboration_types: [],
      preferred_creator_niches: [],
      partnership_goals: "",
      past_collaborations: "",
      is_public: false,
      under_review: false,
      gender: "prefer_not_to_say",
      date_of_birth: "",
      preferred_contact: "email",
      phone: "",
      email: "",
      contact: {
        email: "",
        phone: "",
        preferred_contact: "email",
      },
      engagement_stats: {
        likes: [0, 0, 0],
        comments: [0, 0, 0],
        analyticsImage: "",
        hideAnalytics: false,
      },
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (form.formState.errors) {
        console.log(
          "Form errors:",
          JSON.stringify(form.formState.errors, null, 2),
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error checking auth:", error);
        setLoading(false);
        navigate("/login");
        return;
      }

      if (!session) {
        setLoading(false);
        navigate("/login");
        return;
      }

      setUser(session.user);

      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          if (profileError.code !== "PGRST116") {
            console.error("Error fetching profile:", profileError);
            toast.error("Failed to load profile data");
          }
          // Initialize form with user data for new users
          form.reset({
            name: session.user.user_metadata?.name || "",
            bio: "",
            location: "",
            website: "",
            followers_count: 0,
            categories: [],
            platforms: [],
            budget_range: "",
            min_budget: 0,
            max_budget: 0,
            collaboration_types: [],
            preferred_creator_niches: [],
            partnership_goals: "",
            past_collaborations: "",
            is_public: false,
            under_review: false,
            contact: {
              email: session.user.email || "",
              phone: "",
              preferred_contact: "email",
            },
            engagement_stats: {
              likes: [0, 0, 0],
              comments: [0, 0, 0],
              analyticsImage: "",
              hideAnalytics: false,
            },
            gender: "prefer_not_to_say",
            date_of_birth: "",
            email: session.user.email || "",
          });
          setAvatarUrl(session.user.user_metadata?.avatar_url || null);
        } else if (profileData) {
          console.log("Loading profile data:", profileData);
          // Cast profileData to unknown first, then to UserProfile
          const typedProfileData = profileData as UserProfile;

          // Ensure array fields are properly formatted
          const ensureArray = (value: any) =>
            Array.isArray(value) ? value : value ? [value] : [];

          setProfile(typedProfileData);
          setSocialLinks(typedProfileData.social_links || []);
          setTotalFollowers(
            typedProfileData.social_links?.reduce(
              (sum, link) => sum + (link.followers || 0),
              0,
            ) || 0,
          );
          setAvatarUrl(typedProfileData.avatar_url || null);

          form.reset({
            name: typedProfileData.name || "",
            bio: typedProfileData.bio || "",
            location: typedProfileData.location || "",
            website: typedProfileData.website || "",
            followers_count: typedProfileData.followers_count || 0,
            categories: ensureArray(typedProfileData.categories),
            platforms: ensureArray(typedProfileData.platforms),
            budget_range: typedProfileData.budget_range || "",
            min_budget: typedProfileData.min_budget || 0,
            max_budget: typedProfileData.max_budget || 0,
            collaboration_types: ensureArray(
              typedProfileData.collaboration_types,
            ),
            preferred_creator_niches: ensureArray(
              typedProfileData.preferred_creator_niches,
            ),
            partnership_goals: typedProfileData.partnership_goals || "",
            past_collaborations: typedProfileData.past_collaborations || "",
            is_public: typedProfileData.is_public || false,
            under_review: typedProfileData.under_review || false,
            contact: {
              email: typedProfileData.email || "",
              phone: typedProfileData.phone || "",
              preferred_contact: typedProfileData.preferred_contact || "email",
            },
            engagement_stats: {
              likes: typedProfileData.engagement_stats?.likes || [0, 0, 0],
              comments: typedProfileData.engagement_stats?.comments || [
                0, 0, 0,
              ],
              analyticsImage:
                typedProfileData.engagement_stats?.analyticsImage || "",
              hideAnalytics:
                typedProfileData.engagement_stats?.hideAnalytics || false,
            },
            gender: typedProfileData.gender || "prefer_not_to_say",
            date_of_birth: typedProfileData.date_of_birth || "",
            email: typedProfileData.email || "",
            phone: typedProfileData.phone || "",
            preferred_contact: typedProfileData.preferred_contact || "email",
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error in profile setup:", error);
        toast.error("Failed to set up profile");
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleSaveProfile = async (submitForReview = false) => {
    console.log("handleSaveProfile called");

    try {
      // Fix array fields that might be strings
      const formValues = form.getValues();

      // Check if collaboration_types is a string and convert to array if needed
      if (typeof formValues.collaboration_types === "string") {
        form.setValue(
          "collaboration_types",
          formValues.collaboration_types
            ? [formValues.collaboration_types]
            : [],
        );
      }

      // Check if preferred_creator_niches is a string and convert to array if needed
      if (typeof formValues.preferred_creator_niches === "string") {
        form.setValue(
          "preferred_creator_niches",
          formValues.preferred_creator_niches
            ? [formValues.preferred_creator_niches]
            : [],
        );
      }

      // Validate form manually
      const isValid = await form.trigger();
      if (!isValid) {
        console.log("Form validation failed:", form.formState.errors);
        return;
      }

      const formData = form.getValues();
      console.log("Form data:", formData);

      if (!user) {
        console.error("No user found");
        toast.error("You must be logged in to save your profile");
        return;
      }

      setSaving(true);

      // Clean up engagement stats data
      const cleanedEngagementStats = formData.engagement_stats
        ? {
            ...formData.engagement_stats,
            likes: formData.engagement_stats.likes || [0, 0, 0],
            comments: formData.engagement_stats.comments || [0, 0, 0],
            hideAnalytics: formData.engagement_stats.hideAnalytics || false,
          }
        : undefined;

      // Prepare profile data
      const profileData = {
        id: user.id,
        type: profile?.type || "creator",
        name: formData.name,
        bio: formData.bio || "",
        location: formData.location || "",
        website: formData.website || "",
        followers_count: formData.followers_count || 0,
        categories: Array.isArray(formData.categories)
          ? formData.categories
          : formData.categories
            ? [formData.categories]
            : [],
        platforms: Array.isArray(formData.platforms)
          ? formData.platforms
          : formData.platforms
            ? [formData.platforms]
            : [],
        budget_range: formData.budget_range || "",
        min_budget: formData.min_budget || 0,
        max_budget: formData.max_budget || 0,
        collaboration_types: Array.isArray(formData.collaboration_types)
          ? formData.collaboration_types
          : formData.collaboration_types
            ? [formData.collaboration_types]
            : [],
        preferred_creator_niches: Array.isArray(
          formData.preferred_creator_niches,
        )
          ? formData.preferred_creator_niches
          : formData.preferred_creator_niches
            ? [formData.preferred_creator_niches]
            : [],
        partnership_goals: formData.partnership_goals || "",
        past_collaborations: formData.past_collaborations || "",
        // Always set is_public to false for creators submitting their profile
        is_public:
          profile?.type === "brand" ? formData.is_public || false : false,
        // Only set under_review to true if explicitly submitting for review
        under_review: submitForReview ? true : profile?.under_review || false,
        social_links: socialLinks,
        email: formData.email || formData.contact?.email || "",
        phone: formData.phone || formData.contact?.phone || "",
        preferred_contact:
          formData.preferred_contact ||
          formData.contact?.preferred_contact ||
          "email",
        avatar_url: avatarUrl,
        engagement_stats: cleanedEngagementStats,
        gender: formData.gender || null,
        date_of_birth: formData.date_of_birth || null,
        updated_at: new Date().toISOString(),
      };

      console.log("Saving profile data:", profileData);

      const { error } = await supabase.from("profiles").upsert(profileData);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (submitForReview) {
        toast.success("Profile submitted for review!");
      } else {
        toast.success("Profile saved successfully!");
      }
      navigate("/profile");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(
        "Failed to save profile: " + (error.message || "Unknown error"),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files || !event.target.files[0]) return;

    setUploadingAvatar(true);

    try {
      const file = event.target.files[0];

      // Validate file size
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        setUploadingAvatar(false);
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a valid image file (JPEG, PNG, or GIF)");
        setUploadingAvatar(false);
        return;
      }

      // Upload to Supabase Storage
      const fileExt = file.type.split("/")[1];
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Remove old avatar if exists
      if (avatarUrl) {
        const oldPath = avatarUrl.split("/").pop();
        if (oldPath) {
          await supabase.storage
            .from("profiles")
            .remove([`avatars/${oldPath}`]);
        }
      }

      // Upload new avatar
      const { error: uploadError, data } = await supabase.storage
        .from("profiles")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("profiles").getPublicUrl(filePath);

      setAvatarUrl(publicUrl);

      // Update the profile with the new avatar URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) {
        throw updateError;
      }

      toast.success("Avatar updated successfully");
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error(
        `Failed to upload avatar: ${error.message || "Unknown error"}`,
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string | number,
  ) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);

    // Update total followers
    const total = newLinks.reduce(
      (sum, link) => sum + (link.followers || 0),
      0,
    );
    setTotalFollowers(total);
    form.setValue("followers_count", total);
  };

  const addSocialLink = () => {
    setSocialLinks([
      ...socialLinks,
      { platform: "other", url: "", followers: 0 },
    ]);
  };

  const removeSocialLink = (index: number) => {
    const newLinks = socialLinks.filter((_, i) => i !== index);
    setSocialLinks(newLinks);

    // Update total followers
    const total = newLinks.reduce(
      (sum, link) => sum + (link.followers || 0),
      0,
    );
    setTotalFollowers(total);
    form.setValue("followers_count", total);
  };

  const getUserInitials = () => {
    if (!profile?.name && !user?.user_metadata?.name) return "U";

    const nameToUse = profile?.name || user?.user_metadata?.name || "";

    return nameToUse
      .split(" ")
      .map((name: string) => name[0])
      .join("")
      .toUpperCase();
  };

  const getPlatformIcon = (platform: string) => {
    const found = platformOptions.find((p) => p.value === platform);
    const IconComponent = found?.icon || Globe;
    return <IconComponent className="h-4 w-4" />;
  };

  const platformOptions = [
    { value: "instagram", label: "Instagram", icon: Instagram },
    { value: "twitter", label: "Twitter", icon: Twitter },
    { value: "facebook", label: "Facebook", icon: Facebook },
    { value: "linkedin", label: "LinkedIn", icon: Linkedin },
    { value: "youtube", label: "YouTube", icon: Youtube },
    { value: "tiktok", label: "TikTok", icon: Send },
    { value: "other", label: "Other", icon: Globe },
  ];

  const getCategories = () => {
    return profile?.type === "brand" ? brandCategories : creatorCategories;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container max-w-4xl py-10">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <Form {...form}>
          <form className="space-y-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold">Edit Profile</h1>
                <p className="text-muted-foreground mt-1">
                  Update your profile information
                </p>
              </div>
              <div className="flex gap-2">
                {profile?.type === "creator" &&
                  !profile?.is_public &&
                  !profile?.under_review && (
                    <Button
                      type="button"
                      disabled={saving}
                      onClick={() => handleSaveProfile(true)}
                      variant="secondary"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit for Review"
                      )}
                    </Button>
                  )}
                {profile?.type === "creator" && profile?.under_review && (
                  <Button type="button" disabled={true} variant="outline">
                    Under Review
                  </Button>
                )}
                <Button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSaveProfile(false)}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>

            {profile?.type === "brand" ? (
              // Brand profile - only basic information
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Add your brand details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={avatarUrl || undefined} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={uploadingAvatar}
                        onClick={() =>
                          document.getElementById("avatar-upload")?.click()
                        }
                      >
                        {uploadingAvatar ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Change Avatar"
                        )}
                      </Button>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your brand name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your brand..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Where are you based?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="Your website URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Categories</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {brandCategories.map((category) => (
                            <Badge
                              key={category}
                              variant={
                                field.value?.includes(category)
                                  ? "default"
                                  : "outline"
                              }
                              className="cursor-pointer"
                              onClick={() => {
                                const current = field.value || [];
                                const updated = current.includes(category)
                                  ? current.filter((c) => c !== category)
                                  : [...current, category];
                                field.onChange(updated);
                              }}
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Contact email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Contact phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact.preferred_contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Contact Method</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ) : (
              // Creator profile - show all tabs
              <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
                  <TabsTrigger value="basic" className="text-xs sm:text-sm">
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="social" className="text-xs sm:text-sm">
                    Social Media
                  </TabsTrigger>
                  <TabsTrigger
                    value="engagement"
                    className="text-xs sm:text-sm"
                  >
                    Engagement
                  </TabsTrigger>
                  <TabsTrigger
                    value="preferences"
                    className="text-xs sm:text-sm"
                  >
                    Preferences
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Picture</CardTitle>
                      <CardDescription>
                        Upload a profile picture to make your profile more
                        recognizable.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                      <div className="relative">
                        <Avatar className="h-24 w-24 border-2 border-muted">
                          <AvatarImage
                            src={avatarUrl || ""}
                            alt={profile?.name || "Profile"}
                          />
                          <AvatarFallback className="text-xl">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        {uploadingAvatar && (
                          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full">
                            <Loader2 className="h-5 w-5 animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <Label htmlFor="avatar" className="text-sm font-medium">
                          Change profile picture
                        </Label>
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          disabled={uploadingAvatar}
                        />
                        <p className="text-xs text-muted-foreground">
                          Recommended: Square image, at least 400x400 pixels
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Basic Information</CardTitle>
                      <CardDescription>
                        This information will be displayed publicly on your
                        profile.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your name or brand name"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Your full name or brand name
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell others about yourself or your brand..."
                                className="min-h-[120px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              <span
                                className={`${form.watch("bio")?.length || 0 > 450 ? "text-orange-500" : ""}`}
                              >
                                {form.watch("bio")?.length || 0}/500 characters
                              </span>
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="City, Country" {...field} />
                            </FormControl>
                            <FormDescription>
                              Where are you based? (optional)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                  <SelectItem value="prefer_not_to_say">
                                    Prefer not to say
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormDescription>
                              Your gender (optional)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="date_of_birth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                placeholder="YYYY-MM-DD"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Your date of birth (optional)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="social" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Social Media Links</CardTitle>
                      <CardDescription>
                        Add your social media profiles to connect with others.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        {socialLinks.map((link, index) => (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row gap-4"
                          >
                            <div className="w-full sm:w-1/4">
                              <Label>Platform</Label>
                              <Select
                                value={link.platform}
                                onValueChange={(value) =>
                                  updateSocialLink(index, "platform", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {platformOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      <div className="flex items-center gap-2">
                                        {getPlatformIcon(option.value)}
                                        {option.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="w-full sm:w-2/4">
                              <Label>URL</Label>
                              <Input
                                placeholder="Profile URL"
                                value={link.url}
                                onChange={(e) =>
                                  updateSocialLink(index, "url", e.target.value)
                                }
                              />
                            </div>

                            <div className="w-full sm:w-1/4">
                              <Label>Followers</Label>
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  placeholder="Followers"
                                  value={link.followers || ""}
                                  onChange={(e) =>
                                    updateSocialLink(
                                      index,
                                      "followers",
                                      Number.parseInt(e.target.value) || 0,
                                    )
                                  }
                                  disabled={!link.url}
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  type="button"
                                  onClick={() => removeSocialLink(index)}
                                  className="shrink-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={addSocialLink}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Social Link
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="engagement" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Engagement Stats</CardTitle>
                      <CardDescription>
                        Add your engagement metrics to help brands understand
                        your reach
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProfileEngagementStats
                        onStatsChange={(stats) => {
                          form.setValue("engagement_stats", stats, {
                            shouldDirty: true,
                            shouldTouch: true,
                          });
                        }}
                        initialStats={
                          form.getValues("engagement_stats") ||
                          profile?.engagement_stats
                        }
                        totalFollowers={totalFollowers}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Creator Preferences</CardTitle>
                      <CardDescription>
                        Set your preferences for collaborations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="categories"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content Categories</FormLabel>
                            <div className="flex flex-wrap gap-2">
                              {getCategories().map((category) => (
                                <Badge
                                  key={category}
                                  variant={
                                    field.value?.includes(category)
                                      ? "default"
                                      : "outline"
                                  }
                                  className="cursor-pointer"
                                  onClick={() => {
                                    const current = field.value || [];
                                    const updated = current.includes(category)
                                      ? current.filter((c) => c !== category)
                                      : [...current, category];
                                    field.onChange(updated);
                                  }}
                                >
                                  {category}
                                </Badge>
                              ))}
                            </div>
                            <FormDescription>
                              Select the categories that best describe your
                              content
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="platforms"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Platforms</FormLabel>
                            <div className="flex flex-wrap gap-2">
                              {PLATFORMS.map((platform) => (
                                <Badge
                                  key={platform}
                                  variant={
                                    field.value?.includes(platform)
                                      ? "default"
                                      : "outline"
                                  }
                                  className="cursor-pointer"
                                  onClick={() => {
                                    const current = field.value || [];
                                    const updated = current.includes(platform)
                                      ? current.filter((p) => p !== platform)
                                      : [...current, platform];
                                    field.onChange(updated);
                                  }}
                                >
                                  {platform}
                                </Badge>
                              ))}
                            </div>
                            <FormDescription>
                              Select the platforms where you create content
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </form>
        </Form>
      </main>

      <Footer />
    </div>
  );
};

export default ProfileEdit;
