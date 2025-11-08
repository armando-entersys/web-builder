"use client";

import { useState } from "react";
import { Button } from "@relume_io/relume-ui";
import { Navbar1 } from "@/components/scram/navbar";
import { Header1 } from "@/components/scram/header";
import { CTA8 } from "@/components/scram/cta";
import { Footer1 } from "@/components/scram/footer";
import { DotPattern, GridPattern, Meteors } from "@/components/effects/background";
import { AnimatedGradientText, TypingAnimation, ShimmerButton } from "@/components/effects/text";
// Componentes de React Bits que no requieren dependencias externas
// import { FadeContent } from "@/components/animations/transitions";
import { InputOTP, SearchInput, FileUpload } from "@/components/advanced/forms";
import { Toast, ProgressBar, Skeleton, SkeletonCard } from "@/components/advanced/feedback";
import { EmptyState, Container } from "@/components/advanced/layout";

export default function TestComponentsPage() {
  const [showToast, setShowToast] = useState(false);
  const [otp, setOtp] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar Test */}
      <Navbar1
        logo={{
          url: "/",
          src: "https://via.placeholder.com/150x50/000000/FFFFFF?text=LOGO",
          alt: "Logo",
        }}
        navLinks={[
          { title: "Inicio", url: "#" },
          { title: "Componentes", url: "#componentes" },
          { title: "Documentación", url: "#docs" },
        ]}
        buttons={[
          { title: "Demo", variant: "secondary" },
          { title: "Comenzar", variant: "primary" },
        ]}
      />

      {/* Hero with Background Pattern */}
      <section className="relative overflow-hidden py-20">
        <DotPattern className="opacity-30" />
        <Container className="relative z-10">
          <div className="text-center">
              <AnimatedGradientText className="mb-6">
                ✨ Scram Component Library
              </AnimatedGradientText>
              <TypingAnimation
                text="169 Componentes Profesionales"
                className="mb-6 text-5xl font-bold"
              />
              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                Sistema completo de componentes UI con animaciones, efectos y formularios avanzados
              </p>
              <ShimmerButton className="mx-auto">
                Explorar Componentes
              </ShimmerButton>
            </div>
        </Container>
      </section>

      {/* Components Showcase */}
      <Container size="xl" className="py-20">
        <div className="space-y-20">
          {/* Section: Layout Components */}
          <section id="componentes">
            <h2 className="mb-8 text-3xl font-bold">Componentes de Layout</h2>
            <div className="space-y-12">
              <Header1
                heading="Medium length hero heading goes here"
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique."
                buttons={[
                  { title: "Primary", variant: "primary" },
                  { title: "Secondary", variant: "secondary" },
                ]}
                image={{
                  src: "https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Hero+Image",
                  alt: "Hero image",
                }}
              />

              <div className="rounded-lg border border-border bg-card p-8">
                <CTA8
                  heading="Ready to get started?"
                  description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                  buttons={[
                    { title: "Get Started", variant: "primary" },
                    { title: "Learn More", variant: "secondary" },
                  ]}
                />
              </div>
            </div>
          </section>

          {/* Section: Advanced Forms */}
          <section>
            <h2 className="mb-8 text-3xl font-bold">Formularios Avanzados</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 text-xl font-semibold">Input OTP</h3>
                <InputOTP
                  length={6}
                  value={otp}
                  onChange={setOtp}
                  onComplete={(value) => {
                    console.log("OTP Complete:", value);
                    setShowToast(true);
                  }}
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Valor actual: {otp || "Ninguno"}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 text-xl font-semibold">Search Input</h3>
                <SearchInput
                  placeholder="Buscar componentes..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSearch={(query) => console.log("Search:", query)}
                  debounceMs={300}
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Búsqueda: {searchQuery || "Ninguna"}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-6 md:col-span-2">
                <h3 className="mb-4 text-xl font-semibold">File Upload</h3>
                <FileUpload
                  accept="image/*"
                  maxSize={10 * 1024 * 1024}
                  multiple={true}
                  onUpload={(files) => {
                    console.log("Files uploaded:", files);
                    setShowToast(true);
                  }}
                />
              </div>
            </div>
          </section>

          {/* Section: Feedback Components */}
          <section>
            <h2 className="mb-8 text-3xl font-bold">Componentes de Feedback</h2>
            <div className="space-y-8">
              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 text-xl font-semibold">Progress Bar</h3>
                <div className="space-y-4">
                  <ProgressBar value={25} showLabel variant="default" />
                  <ProgressBar value={50} showLabel variant="success" />
                  <ProgressBar value={75} showLabel variant="warning" />
                  <ProgressBar value={90} showLabel variant="error" />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 text-xl font-semibold">Skeleton Loading</h3>
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-8 w-1/2" />
                  <div className="pt-4">
                    <SkeletonCard />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <h3 className="mb-4 text-xl font-semibold">Toast Notifications</h3>
                <div className="flex gap-4">
                  <Button onClick={() => setShowToast(true)} variant="primary">
                    Mostrar Toast
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Background Effects */}
          <section>
            <h2 className="mb-8 text-3xl font-bold">Efectos de Background</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="relative h-64 overflow-hidden rounded-lg border border-border">
                <GridPattern className="opacity-50" />
                <div className="relative z-10 flex h-full items-center justify-center">
                  <p className="text-lg font-semibold">Grid Pattern</p>
                </div>
              </div>

              <div className="relative h-64 overflow-hidden rounded-lg border border-border bg-slate-900">
                <Meteors number={15} />
                <div className="relative z-10 flex h-full items-center justify-center">
                  <p className="text-lg font-semibold text-white">Meteors Effect</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Empty State */}
          <section>
            <h2 className="mb-8 text-3xl font-bold">Estados Especiales</h2>
            <div className="rounded-lg border border-border bg-card p-6">
              <EmptyState
                icon={
                  <svg
                    className="h-24 w-24 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                }
                title="No hay resultados"
                description="No se encontraron componentes con esos criterios. Intenta ajustar tu búsqueda."
                action={{
                  label: "Limpiar filtros",
                  onClick: () => console.log("Clear filters"),
                }}
              />
            </div>
          </section>

          {/* Section: UI Components */}
          <section>
            <h2 className="mb-8 text-3xl font-bold">Componentes UI Base</h2>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="link">Link Button</Button>
              </div>
            </div>
          </section>
        </div>
      </Container>

      {/* Footer */}
      <Footer1
        logo={{
          url: "/",
          src: "https://via.placeholder.com/150x50/000000/FFFFFF?text=LOGO",
          alt: "Logo",
        }}
        linkColumns={[
          {
            title: "Producto",
            links: [
              { title: "Características", url: "#" },
              { title: "Precios", url: "#" },
            ],
          },
          {
            title: "Recursos",
            links: [
              { title: "Documentación", url: "#" },
              { title: "Guías", url: "#" },
            ],
          },
        ]}
        socialLinks={[
          { href: "#", icon: <span>F</span> },
          { href: "#", icon: <span>T</span> },
        ]}
        footerText="© 2025 Scram. Todos los derechos reservados."
        footerLinks={[
          { title: "Privacidad", url: "#" },
          { title: "Términos", url: "#" },
        ]}
      />

      {/* Toast Container */}
      {showToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast
            message="¡Operación exitosa!"
            type="success"
            duration={3000}
            onClose={() => setShowToast(false)}
          />
        </div>
      )}
    </div>
  );
}
