import { useEffect, useState } from "react";
import { type Session } from "@supabase/supabase-js";
import { MagicLink } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogIn, LogOut } from "lucide-react";
import {
  loadStoreFromLocalStorage,
  RadioStationsStore,
  radioStationsStore,
  RadioStationStoreSchema,
  setRadioStationStore,
} from "@/stores/radio-stations";
import { snapshot, subscribe } from "valtio";

export const AuthenticationButton = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const email = session?.user.email;

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setIsDialogOpen(false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let unsubProxy = () => {};

    const request = async () => {
      if (!email) {
        return;
      }
      const snap = snapshot(radioStationsStore);

      const result = await supabase
        .from("stations")
        .select("data")
        .eq("email", email)
        .limit(1);

      const count = result.data?.length ?? 0;

      if (!count) {
        const next: RadioStationsStore = {
          owner: snap.owner,
          stations: [...snap.stations],
        };

        next.owner = email;

        await supabase.from("stations").insert({
          email,
          data: JSON.stringify(next),
        });

        setRadioStationStore(next);
      } else if (result.data?.[0]) {
        const remoteStore = RadioStationStoreSchema.parse(
          JSON.parse(result.data[0].data)
        );

        setRadioStationStore(remoteStore);
      }

      unsubProxy = subscribe(radioStationsStore, () => {
        const subscriptionSnapshot = snapshot(radioStationsStore);
        supabase
          .from("stations")
          .update({
            data: JSON.stringify(subscriptionSnapshot),
          })
          .eq("email", email)
          .then((result) => {
            console.log(result);
          });
      });
    };

    request();

    return () => {
      unsubProxy();
    };
  }, [email]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setRadioStationStore(loadStoreFromLocalStorage("anonymous"));
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-xl/30"
        >
          {session ? <LogOut /> : <LogIn />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {session ? "Account Management" : "Sign In / Sign Up"}
          </DialogTitle>
          <DialogDescription>
            {session ? (
              `Signed in as ${session.user.email}.`
            ) : (
              <>
                Enter your email below to receive a magic link to sign in or
                create an account.
                <br />
                <br />
                An account is only needed to save your stations across devices.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {!session ? (
            <MagicLink
              supabaseClient={supabase}
              providers={[]}
              appearance={{ theme: ThemeSupa }}
              redirectTo={getRedirectToUrl()}
            />
          ) : (
            <Button onClick={handleSignOut} className="w-full">
              Sign out
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

function getRedirectToUrl() {
  let url =
    import.meta?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    import.meta?.env?.NEXT_PUBLIC_VERCEL_URL; // Automatically set by Vercel.

  if (!url) {
    return undefined;
  }

  url = url.startsWith("http") ? url : `https://${url}`;
  // Make sure to include a trailing `/`.
  url = url.endsWith("/") ? url : `${url}/`;
  return url;
}
