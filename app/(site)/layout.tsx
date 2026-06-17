import AgeGate from "@/components/AgeGate";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

/** Layout do site público: Navbar + conteúdo + Footer. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AgeGate />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
