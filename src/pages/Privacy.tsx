import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PRIVACY_TEXT = `
Privacy Policy

Last updated: February 2025

1. Introduction

Welcome to Face Crush (the "Game"). This Privacy Policy describes how we handle information when you play our game. We built Face Crush to be a simple, fun puzzle game. We do not collect, store, or transmit your personal data for the purpose of running the game. Please read this policy to understand your privacy when using our services.

2. Information We Do Not Collect

The Game is designed to run on your device without sending your data to our servers. We do not:

• Collect or log your IP address, device identifiers, or location.
• Require an account, sign-in, or registration to play.
• Use analytics, tracking, or advertising that collects personal information.
• Store your gameplay (scores, level progress) on our servers—any such data exists only in your current session on your device.

3. How the Game Works

Face Crush runs locally in your browser or on your device. Game state (score, level, combo) is kept in memory during your session and is not sent to us or stored by us. When you close the Game or refresh the page, that session data is cleared. We do not have access to how you play or how long you play.

4. Information That Might Be Collected by Others

• App stores (e.g., Apple App Store, Google Play) or web hosting providers may collect standard technical data (such as IP address or device type) as part of their own services. We do not receive, use, or control that data for the Game.
• If you contact us for support (e.g., by email), we will use the contact details you provide only to respond. We do not use them for marketing unless you agree.

5. Children's Privacy

The Game is suitable for general audiences. We do not knowingly collect personal information from anyone, including children under 13. If you are a parent or guardian and believe your child has shared personal information with us, please contact us and we will address it.

6. Changes to This Policy

We may update this Privacy Policy from time to time. We will post the updated version on this page and change the "Last updated" date. Continued use of the Game after changes means you accept the updated policy.

7. Contact Us

If you have questions about this Privacy Policy or the Game, you can contact us at:

Email: privacy@emojicrush.example.com
`;

const Privacy = () => (
  <div className="min-h-screen bg-gradient-to-b from-[hsl(270,60%,16%)] via-background to-[hsl(270,60%,8%)]">
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/">← Back to Game</Link>
        </Button>
      </div>
      <Card className="border-border bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh] w-full rounded-md border border-border/50 p-4">
            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {PRIVACY_TEXT.trim()}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Privacy;
