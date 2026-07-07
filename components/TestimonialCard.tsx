type Testimonial = {
  name: string;
  role: string;
  quote: string;
  imageUrl?: string;
};

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="rounded-2xl border border-surface-2 bg-surface p-6">
      <p className="font-body text-sm italic leading-relaxed text-muted">
        "{testimonial.quote}"
      </p>
      <div className="mt-4 flex items-center gap-3">
        {testimonial.imageUrl ? (
          <img
            src={testimonial.imageUrl}
            alt={testimonial.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 font-mono text-sm text-accent">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-body text-sm font-medium text-text">{testimonial.name}</p>
          <p className="font-body text-xs text-muted">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}