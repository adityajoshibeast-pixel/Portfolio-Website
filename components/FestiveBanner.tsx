type FestiveOfferProps = {
  title: string;
  description: string;
  discountText: string;
};

export default function FestiveBanner({ title, description, discountText }: FestiveOfferProps) {
  return (
    <div className="bg-accent px-6 py-3 text-center">
      <p className="font-body text-sm font-medium text-bg">
        🎉 <span className="font-semibold">{title}</span>
        {discountText && <span> — {discountText}</span>}
        {description && <span className="hidden sm:inline"> · {description}</span>}
      </p>
    </div>
  );
}