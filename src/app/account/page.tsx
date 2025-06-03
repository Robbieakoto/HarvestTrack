
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Edit3, UploadCloud, Phone, Mail, Building, MapPin, UserCircle, AlertTriangle } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
// To be implemented: functions for Firebase Storage and Firestore
// import { uploadProfilePicture, updateUserProfileDocument } from '@/lib/firebase-services'; // Placeholder

const accountSettingsSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  username: z.string().optional(),
  phoneNumber: z.string().optional(), // Add more specific validation if needed (e.g., E.164)
  email: z.string().email().readonly(),
  businessName: z.string().optional(),
  locationAddress: z.string().optional(),
  profilePictureFile: z.instanceof(File).optional().nullable(),
});

type AccountSettingsFormValues = z.infer<typeof accountSettingsSchema>;

export default function AccountSettingsPage() {
  const { user, loading: authLoading, setUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<AccountSettingsFormValues>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      fullName: '',
      username: '',
      phoneNumber: '',
      email: '',
      businessName: '',
      locationAddress: '',
      profilePictureFile: null,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.displayName || '',
        email: user.email || '',
        // These fields would typically be loaded from Firestore
        username: '', // Load from Firestore user profile
        phoneNumber: '', // Load from Firestore user profile
        businessName: '', // Load from Firestore user profile
        locationAddress: '', // Load from Firestore user profile
        profilePictureFile: null,
      });
      if (user.photoURL) {
        setPreviewImage(user.photoURL);
      }
    }
  }, [user, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('profilePictureFile', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit: SubmitHandler<AccountSettingsFormValues> = async (data) => {
    setIsLoading(true);
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to update settings.' });
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Update Firebase Auth profile (displayName, photoURL)
      let newPhotoURL = user.photoURL;
      if (data.profilePictureFile) {
        // Placeholder for actual upload logic
        // newPhotoURL = await uploadProfilePicture(user.uid, data.profilePictureFile);
        toast({ title: 'Info', description: 'Profile picture upload logic is a placeholder.' });
        // For now, we'll just simulate it was successful if a file was selected
        if (previewImage && previewImage.startsWith('data:')) {
           newPhotoURL = previewImage; // Using local preview for demo
        }
      }

      await updateProfile(user, {
        displayName: data.fullName,
        photoURL: newPhotoURL,
      });
      
      // Update user in AuthContext immediately for displayName and photoURL
      // The onAuthStateChanged listener will also pick up changes eventually
      const updatedUser = { ...user, displayName: data.fullName, photoURL: newPhotoURL };
      setUser(updatedUser as any); // Cast needed as internal User type might differ slightly

      // Step 2: Update additional profile information in Firestore (username, phone, business, location)
      // const additionalProfileData = {
      //   username: data.username,
      //   phoneNumber: data.phoneNumber,
      //   businessName: data.businessName,
      //   locationAddress: data.locationAddress,
      // };
      // await updateUserProfileDocument(user.uid, additionalProfileData); // Placeholder
      toast({ title: 'Info', description: 'Saving additional fields (username, phone, etc.) to Firestore is a placeholder.' });


      toast({ title: 'Settings Saved', description: 'Your account information has been updated.' });
      form.reset({ ...form.getValues(), profilePictureFile: null }); // Reset file input after "save"
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({ variant: 'destructive', title: 'Update Failed', description: error.message || 'Could not update your settings.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
     return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/> Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
                <p>You need to be logged in to view this page.</p>
            </CardContent>
            <CardFooter>
                <Button onClick={() => window.location.href = '/auth/signin'} className="w-full">Go to Sign In</Button>
            </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline flex items-center gap-2">
            <User className="h-8 w-8 text-primary" /> Account Settings
          </CardTitle>
          <CardDescription>Manage your profile information and preferences.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-8">
              {/* Profile Picture Section */}
              <FormField
                control={form.control}
                name="profilePictureFile"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
                     <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2">
                      <AvatarImage src={previewImage || user.photoURL || undefined} alt={user.displayName || 'User'} data-ai-hint="person portrait" />
                      <AvatarFallback>
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserCircle className="h-12 w-12" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-2">
                    <FormLabel htmlFor="profilePictureInput" className="text-base">Profile Picture</FormLabel>
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <UploadCloud className="mr-2 h-4 w-4" /> Change Picture
                    </Button>
                    <FormControl>
                      <Input
                        id="profilePictureInput"
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                      />
                    </FormControl>
                    <FormDescription>Recommended: Square image, less than 5MB.</FormDescription>
                    <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2"><Edit3 className="h-5 w-5 text-muted-foreground" />Personal Information</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground" />Full Name</FormLabel>
                            <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center"><UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />Username (Optional)</FormLabel>
                            <FormControl><Input placeholder="your_username" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground" />Phone Number</FormLabel>
                            <FormControl><Input type="tel" placeholder="+1 (555) 123-4567" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Email Address</FormLabel>
                            <FormControl><Input type="email" {...field} readOnly className="bg-muted/50 cursor-not-allowed" /></FormControl>
                            <FormDescription>Email address cannot be changed here.</FormDescription>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                 </div>
              </div>


              {/* Business Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2"><Building className="h-5 w-5 text-muted-foreground" />Business/Organization</h3>
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business/Organization Name (Optional)</FormLabel>
                      <FormControl><Input placeholder="Your Company Inc." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locationAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-muted-foreground" />Location/Address (Manual Entry)</FormLabel>
                      <FormControl><Textarea placeholder="123 Main St, Anytown, USA" {...field} rows={3} /></FormControl>
                      <FormDescription>Enter your primary business address.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading || authLoading} className="w-full sm:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Edit3 className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
