import { ArrowLeft, Camera, Phone, GraduationCap, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ViewProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profilePicture: "",
    dateOfBirth: "",
    education: "",
    phoneNumber: "",
    motherName: "",
    fatherName: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("http://localhost:8000/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setUserData({
        name: data.name || "",
        email: data.email || "",
        profilePicture: data.profile_pic || "",
        dateOfBirth: data.date_of_birth || "",
        education: data.education || "",
        phoneNumber: data.phone_number || "",
        motherName: data.mother_name || "",
        fatherName: data.father_name || "",
      });
    };

    fetchUser();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground">View your profile information</p>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {/* Profile Picture and Basic Info */}
            <div className="flex flex-col items-center text-center mb-8">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={userData.profilePicture} />
                <AvatarFallback className="text-lg">
                  {userData.name.split(" ").map((n) => n[0]).join("") || "JD"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold mb-1">{userData.name}</h2>
              <p className="text-muted-foreground">{userData.email}</p>
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Camera className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Date of Birth</p>
                    <p className="text-muted-foreground">{formatDate(userData.dateOfBirth)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Education</p>
                    <p className="text-muted-foreground">{userData.education}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone Number</p>
                    <p className="text-muted-foreground">{userData.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Heart className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Mother's Name</p>
                    <p className="text-muted-foreground">{userData.motherName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Father's Name</p>
                    <p className="text-muted-foreground">{userData.fatherName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="mt-8 flex justify-center">
              <Button onClick={() => navigate("/edit-profile")} className="w-full sm:w-auto">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewProfile;
