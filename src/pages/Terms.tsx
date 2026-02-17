import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TERMS_TEXT = `
Terms of Use

Last updated: February 2025

1. Acceptance of Terms

By downloading, installing, or playing Face Crush (the "Game"), you agree to these Terms of Use. If you do not agree, please do not use the Game. We may update these terms from time to time; continued use after changes means you accept the updated terms.

2. Description of the Game

Face Crush is a casual puzzle game in which you match emojis to score points and advance levels. The Game is provided for entertainment only. We do not guarantee availability, uninterrupted access, or that the Game will meet any particular purpose.

3. Use of the Game

You may use the Game only for personal, non-commercial play. You agree not to:

• Copy, modify, distribute, or create derivative works of the Game or its content.
• Reverse engineer, decompile, or attempt to extract the source code of the Game (except where permitted by law).
• Use the Game for any illegal purpose or in any way that could harm the Game, other users, or third parties.
• Use bots, scripts, or other automated means to interact with the Game in an unauthorized way.
• Remove or alter any copyright, trademark, or other proprietary notices in the Game.

4. No Account Required

The Game does not require you to create an account or provide personal information to play. Game progress (scores, levels) is stored only in your current session and is not saved to our servers. You are responsible for your use of the device and network you use to access the Game.

5. Intellectual Property

The Game, including its name, design, graphics, sounds, and all content, is owned by us or our licensors and is protected by copyright and other intellectual property laws. We grant you a limited, non-exclusive, non-transferable, revocable license to play the Game for your personal use in accordance with these terms. Nothing in these terms gives you any right to our trademarks or brand.

6. Disclaimer of Warranties

The Game is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the Game will be error-free, secure, or uninterrupted. Your use of the Game is at your sole risk.

7. Limitation of Liability

To the maximum extent permitted by applicable law, we (and our affiliates, directors, employees, and agents) shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, data, or goodwill, arising from your use of or inability to use the Game. In no event shall our total liability exceed the amount you paid to us for the Game in the twelve months preceding the claim (or, if the Game is free, zero). Some jurisdictions do not allow certain limitations; in such cases, our liability will be limited to the fullest extent permitted by law.

8. Age and Eligibility

The Game is intended for general audiences. If you are under the age of 13, you should use the Game only with the involvement and permission of a parent or guardian. By using the Game, you represent that you meet any age or other eligibility requirements in your jurisdiction.

9. Termination

We may suspend or discontinue the Game or your access to it at any time, with or without notice, and for any reason. Upon termination, your right to use the Game ceases immediately. Sections that by their nature should survive (including intellectual property, disclaimers, limitation of liability, and governing law) will survive termination.

10. Governing Law and Disputes

These terms are governed by the laws of the jurisdiction in which we operate, without regard to conflict of law principles. Any dispute arising from these terms or the Game shall be resolved in the courts of that jurisdiction, to the extent permitted by law.

11. Contact Us

If you have questions about these Terms of Use or the Game, you can contact us at:

Email: support@emojicrush.example.com
`;

const Terms = () => (
  <div className="min-h-screen bg-gradient-to-b from-[hsl(270,60%,16%)] via-background to-[hsl(270,60%,8%)]">
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/">← Back to Game</Link>
        </Button>
      </div>
      <Card className="border-border bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-2xl">Terms of Use</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[70vh] w-full rounded-md border border-border/50 p-4">
            <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {TERMS_TEXT.trim()}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default Terms;
