import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import TestimonialCard from "@/components/TestimonialCard";
import ChatWidget from "@/components/ChatWidget";
import FestiveBanner from "@/components/FestiveBanner";
import ContactForm from "@/components/ContactForm";
import connectToDatabase from "@/lib/mongodb";
import Offer from "@/models/Offer";
import About from "@/models/About";
import Contact from "@/models/Contact";
import Resume from "@/models/Resume";
import Testimonial from "@/models/Testimonial";
import FestiveOffer from "@/models/FestiveOffer";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

async function getProjects() {
  await connectToDatabase();
  const offers = await Offer.find().sort({ createdAt: -1 }).lean();

  return offers.map((offer: any) => ({
    id: offer._id.toString(),
    title: offer.title,
    description: offer.description,
    imageUrl: offer.imageUrl,
    tags: offer.tags || [],
    demoLink: offer.demoLink,
  }));
}

async function getAbout() {
  await connectToDatabase();
  const about = await About.findOne().lean();
  return {
    content: (about as any)?.content || "",
    imageUrl: (about as any)?.imageUrl || "",
  };
}

async function getContact() {
  await connectToDatabase();
  const contact = await Contact.findOne().lean();
  return {
    email: (contact as any)?.email || "",
    phone: (contact as any)?.phone || "",
    linkedin: (contact as any)?.linkedin || "",
    github: (contact as any)?.github || "",
    instagram: (contact as any)?.instagram || "",
  };
}

async function getResume() {
  await connectToDatabase();
  const resume = await Resume.findOne().lean();
  return (resume as any)?.url || "";
}

async function getTestimonials() {
  await connectToDatabase();
  const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();

  return testimonials.map((t: any) => ({
    id: t._id.toString(),
    name: t.name,
    role: t.role,
    quote: t.quote,
    imageUrl: t.imageUrl,
  }));
}

async function getFestiveOffer() {
  await connectToDatabase();
  const offer = await FestiveOffer.findOne().lean();
  return {
    isActive: (offer as any)?.isActive || false,
    title: (offer as any)?.title || "",
    description: (offer as any)?.description || "",
    discountText: (offer as any)?.discountText || "",
  };
}

export default async function Home() {
  const projects = await getProjects();
  const about = await getAbout();
  const contact = await getContact();
  const resumeUrl = await getResume();
  const testimonials = await getTestimonials();
  const festiveOffer = await getFestiveOffer();

  return (
    <div className="min-h-screen bg-bg">
      {festiveOffer.isActive && (
        <FestiveBanner
          title={festiveOffer.title}
          description={festiveOffer.description}
          discountText={festiveOffer.discountText}
        />
      )}

      <Navbar />

      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16">
        <div className="overflow-hidden rounded-2xl border border-surface-2 bg-surface shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 border-b border-surface-2 bg-surface-2/50 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400/70"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-400/70"></span>
            <span className="h-3 w-3 rounded-full bg-green-400/70"></span>
            <span className="ml-3 font-mono text-xs text-muted">hello.ts</span>
          </div>

          <div className="p-8 sm:p-12">
            <p className="font-mono text-sm text-accent-2">const developer = {"{"}</p>
            <p className="mt-2 pl-4 font-display text-3xl font-semibold text-text sm:text-4xl">
              name: <span className="text-accent">"Aditya"</span>,
            </p>
            <p className="mt-3 pl-4 font-body text-lg text-muted">
              stack: ["Next.js", "AI APIs", "MongoDB"],
            </p>
            <p className="mt-3 pl-4 font-body text-lg text-muted">
              status: <span className="text-accent">"available_for_freelance"</span>
              <span className="ml-1 text-accent animate-blink">|</span>
            </p>
            <p className="mt-2 font-mono text-sm text-accent-2">{"}"}</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#projects" className="rounded-lg bg-accent px-6 py-3 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90">
                View Projects
              </a>
              <a href="#contact" className="rounded-lg border border-surface-2 px-6 py-3 font-body text-sm font-medium text-text transition-colors hover:border-accent/40">
                Get in Touch
              </a>
              {resumeUrl && (
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-surface-2 px-6 py-3 font-body text-sm font-medium text-text transition-colors hover:border-accent/40">
                  Download Resume
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {about.content && (
        <section id="about" className="mx-auto max-w-6xl px-6 pb-24">
          <h2 className="font-display text-2xl font-semibold text-text">About</h2>
          <div className="mt-6 flex flex-col gap-8 sm:flex-row">
            {about.imageUrl && (
              <img src={about.imageUrl} alt="Aditya" className="h-40 w-40 flex-shrink-0 rounded-2xl object-cover" />
            )}
            <div
              className="font-body text-muted leading-relaxed [&_b]:text-text [&_strong]:text-text [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: about.content }}
            />
          </div>
        </section>
      )}

      <section id="projects" className="mx-auto max-w-6xl px-6 pb-24">
        <h2 className="font-display text-2xl font-semibold text-text">Projects</h2>
        <p className="mt-2 font-body text-muted">A few things I've built and shipped.</p>

        {projects.length === 0 ? (
          <p className="mt-8 font-body text-sm text-muted">No projects added yet — check back soon.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {testimonials.length > 0 && (
        <section id="testimonials" className="mx-auto max-w-6xl px-6 pb-24">
          <h2 className="font-display text-2xl font-semibold text-text">Testimonials</h2>
          <p className="mt-2 font-body text-muted">What people say about working with me.</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
      )}

      <footer id="contact" className="border-t border-surface-2 px-6 py-16 text-center">
        <h2 className="font-display text-2xl font-semibold text-text">Get in Touch</h2>
        <p className="mt-2 font-body text-muted">Have a project in mind? Send me a message.</p>

        <div className="mt-8">
          <ContactForm />
        </div>

        {contact.email && (
          <p className="mt-8 font-body text-sm text-muted">
            Or email directly — <span className="text-accent">{contact.email}</span>
          </p>
        )}
        {contact.phone && (
          <p className="mt-2 font-body text-sm text-muted">{contact.phone}</p>
        )}
        <div className="mt-4 flex justify-center gap-4">
          {contact.linkedin && (
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-muted hover:text-accent">
              LinkedIn
            </a>
          )}
          {contact.github && (
            <a href={contact.github} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-muted hover:text-accent">
              GitHub
            </a>
          )}
          {contact.instagram && (
            <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="font-body text-sm text-muted hover:text-accent">
              Instagram
            </a>
          )}
        </div>
      </footer>

      <ChatWidget />
      <Footer />
    </div>
  );
}