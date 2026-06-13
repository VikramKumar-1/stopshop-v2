"use client";

const stats = [
  { value: "20+", label: "Countries Served" },
  { value: "500+", label: "Orders Delivered" },
  { value: "100%", label: "Quality Checked" },
  { value: "24h", label: "Quote Response" },
];

export const StatsSection = () => {
  return (
    <section className="py-10 md:py-12 relative overflow-hidden section-glass-ambient ambient-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-3xl p-8 sm:p-12 gradient-border">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-2"
              >
                <p className="text-4xl sm:text-5xl font-display font-bold gradient-text">
                  {stat.value}
                </p>
                <p className="text-sm text-muted font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
