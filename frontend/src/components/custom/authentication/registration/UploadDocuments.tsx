import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { uploadFile } from "@/api/file-upload.ts";
import Loading from "@/components/shared/Loading.tsx";
import { assignDocumentToCurrentUser } from "@/api/profile.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store.ts";
import { closeSheet } from "@/types/sheetAction.ts";
import { useNavigate } from 'react-router-dom';
import { UserDocument } from "@/types/user.ts";

const UploadDocuments = () => {

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onFileUpload = async () => {
    setLoading(true);
    const certification = document.getElementById('certification') as HTMLInputElement;
    const cv = document.getElementById('cv') as HTMLInputElement;
    if (!certification.files) {
      setError('Please upload a Certification document');
      return;
    }
    if (!cv.files) {
      setError('Please upload a CV document');
      return;
    }
    const certificationFile = certification.files[0];
    const cvFile = cv.files[0];
    try {
      const certUpload = await uploadFile(certificationFile, false);
      const cvUpload = await uploadFile(cvFile, false);
      if (certUpload.status !== 'success' || cvUpload.status !== 'success') {
        setError('Error uploading documents please try again');
        return;
      }
      await assignDocumentToCurrentUser({
        path: cvUpload.fileUrl,
        title: 'CV',
    } as UserDocument);
      await assignDocumentToCurrentUser({
        path: certUpload.fileUrl,
        title: 'Certification',
      });
      setError(null);
      navigate('/profile');
      dispatch(closeSheet());
    } catch (e) {
      console.error(e);
      setError('Error uploading documents please try again');
    }
    setLoading(false);
  }


  return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription className="text-center">We need some documents in order to verify you.&nbsp;
            <a
              href="/blog/veterinarian"
              target="_blank"
              rel="noopener noreferrer"
              style={{textDecoration: 'underline'}}
            >
              Learn more
            </a>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="picture">Certification</Label>
          <Input id="certification"
                 type="file"
          />
        </CardContent>
        <CardContent>
          <Label htmlFor="cv">CV</Label>
          <Input id="cv"
                 type="file"
          />
        </CardContent>
        <CardContent>
          <Button className="w-full" onClick={onFileUpload} disabled={isLoading}>
            {isLoading && <div className="absolute flex items-center right-14">
                <Loading/>
            </div>}
            Upload Documents
          </Button>
        </CardContent>
        <div className="text-red-500 text-center">
          {error}
        </div>
        <CardContent>
          <Button className="w-full" variant="secondary" onClick={ () => {
            navigate('/profile');
            dispatch(closeSheet());
          }}>
            Skip for now
          </Button>
          <CardDescription className="text-right pt-2">
            You can upload docs later in your profile
          </CardDescription>
        </CardContent>
      </Card>
    )
}
export default UploadDocuments