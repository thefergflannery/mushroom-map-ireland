'use client';

export function SafetyBanner() {
  return (
    <section className="py-6 bg-amber-50 border-y border-amber-200 rounded-md">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex gap-4 items-start">
          <div className="text-3xl">⚠️</div>
          <div>
            <h3 className="text-lg font-bold text-amber-900 mb-2">Important Safety Notice</h3>
            <p className="text-amber-800 mb-1"><strong>Never consume mushrooms based solely on online identification.</strong></p>
            <p className="text-amber-700 text-sm">
              Many edible species have toxic or deadly lookalikes. Always consult an experienced mycologist in person
              before consuming any wild mushroom. This platform is for educational and research purposes only.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


