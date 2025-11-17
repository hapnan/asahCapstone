import { GalleryVerticalEnd } from "lucide-react" // Atau ganti ikon Bank kalian
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40 px-4">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              {/* Logo Bank Holahop/Asah */}
              <GalleryVerticalEnd className="size-6" />
            </div>
          </div>
          <CardTitle className="text-2xl">Bank Holahop</CardTitle>
          <CardDescription>
            Sales Lead Scoring Portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            {/* Input Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@bankholahop.com"
                required
              />
            </div>
            
            {/* Tombol Utama - Passkey */}
            <Button type="submit" className="w-full">
              Log in with Passkey
            </Button>

            {/* Opsi Fallback (Sesuai Project Plan hal. 11) */}
            <div className="text-center text-sm mt-2">
              <span className="text-muted-foreground">or </span>
              <a href="#" className="underline hover:text-primary">
                use a password
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}