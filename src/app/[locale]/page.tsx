import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Zap, Lock, Wrench, ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("LandingPage");

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center space-y-8">
          {/* Status Badge */}
          <Badge
            variant="secondary"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            {t("statusBadge")}
          </Badge>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
              {t("mainHeading")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t("mainSubheading")}
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <Card className="border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-6 text-center">
                <Wrench className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t("featureCards.tools.title")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("featureCards.tools.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t("featureCards.speed.title")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("featureCards.speed.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-6 text-center">
                <Github className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t("featureCards.openSource.title")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("featureCards.openSource.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 hover:border-gray-300 transition-colors">
              <CardContent className="p-6 text-center">
                <Lock className="h-8 w-8 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t("featureCards.privacy.title")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("featureCards.privacy.description")}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main CTA */}
          <div className="pt-8">
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {t("cta.heading")}
                  </h2>
                  <p className="text-gray-600">{t("cta.description")}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Link href="/tools">
                      {t("cta.browseTools")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="https://github.com/paulpietzko/opentools/">
                      <Github className="mr-2 h-4 w-4" />
                      {t("cta.viewOnGithub")}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
