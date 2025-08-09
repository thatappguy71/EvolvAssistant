import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Sidebar, { useSidebar } from "@/components/Sidebar";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Upload, Camera } from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isCollapsed } = useSidebar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });

  const profilePicMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('profileImage', file);
      const response = await fetch('/api/user/profile-image', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload profile image');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string }) => {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }
      
      profilePicMutation.mutate(file);
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate(profileData);
  };

  const getInitials = (firstName?: string | null, lastName?: string | null, email?: string | null) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <main className={`flex-1 ml-0 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} p-4 md:p-8 pt-16 md:pt-8 transition-all duration-300`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600 mt-2">Manage your personal information and account settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Your profile picture is displayed across the platform
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative inline-block">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={user.profileImageUrl || undefined} />
                    <AvatarFallback className="text-xl">
                      {getInitials(user.firstName, user.lastName, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  {profilePicMutation.isPending && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <Upload className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={profilePicMutation.isPending}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {profilePicMutation.isPending ? "Uploading..." : "Change Picture"}
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  JPG, PNG or GIF (max 5MB)
                </p>
              </CardContent>
            </Card>

            {/* Account Information Card */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "Saving..." : (isEditing ? "Save Changes" : "Edit Profile")}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={isEditing ? profileData.firstName : (user.firstName || "")}
                      disabled={!isEditing}
                      placeholder="Enter your first name"
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={isEditing ? profileData.lastName : (user.lastName || "")}
                      disabled={!isEditing}
                      placeholder="Enter your last name"
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled={true}
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    Email address cannot be changed as it's managed by your authentication provider
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Account Status</h4>
                      <p className="text-sm text-gray-500">Your current subscription tier</p>
                    </div>
                    <Badge variant={user.subscriptionTier === 'PREMIUM' ? 'default' : 'secondary'}>
                      {user.subscriptionTier === 'PREMIUM' ? 'Premium Member' : 'Free Member'}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <h4 className="font-medium text-gray-900">Member Since</h4>
                    <p className="text-sm text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Unknown'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Card */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {user.subscriptionTier === 'PREMIUM' ? 'Premium Plan' : 'Free Plan'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {user.subscriptionTier === 'PREMIUM' 
                      ? 'Access to all premium features and unlimited tracking'
                      : 'Limited features with basic habit tracking'
                    }
                  </p>
                </div>
                <div className="flex gap-2">
                  {user.subscriptionTier === 'FREE' && (
                    <Button asChild>
                      <Link href="/premium">
                        Upgrade to Premium
                      </Link>
                    </Button>
                  )}
                  {user.subscriptionTier === 'PREMIUM' && (
                    <Button variant="outline">
                      Manage Subscription
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="mt-8 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Delete Account</h4>
                  <p className="text-sm text-gray-500">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button variant="destructive">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}