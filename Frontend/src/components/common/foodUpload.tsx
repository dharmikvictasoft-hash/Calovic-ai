import { useEffect, useMemo, useState, type ChangeEvent } from "react";

type FoodItem = {
  name: string;
  estimated_weight_grams: number;
  calories: number;
};

type AnalyzeResponse = {
  total_calories: number;
  foods: FoodItem[];
};

function isAnalyzeResponse(payload: unknown): payload is AnalyzeResponse {
  if (!payload || typeof payload !== "object") return false;
  const obj = payload as Record<string, unknown>;
  return typeof obj.total_calories === "number" && Array.isArray(obj.foods);
}

function getApiErrorMessage(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  if (typeof obj.message === "string") return obj.message;
  if (typeof obj.error === "string") return obj.error;
  if (typeof obj.detail === "string") return obj.detail;
  return null;
}

export default function FoodAnalyzer() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [servings, setServings] = useState(1);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    if (!loading) return;

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const step = prev < 40 ? 8 : prev < 75 ? 4 : 2;
        return Math.min(prev + step, 92);
      });
    }, 180);

    return () => window.clearInterval(timer);
  }, [loading]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setServings(1);
    setProgress(0);
    setError("");
  };

  const handleUpload = async () => {
    if (!image) return;

    setLoading(true);
    setProgress(8);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch("https://calovic-ai.onrender.com/analyze-food", {
        method: "POST",
        body: formData,
      });

      let payload: unknown = null;
      try {
        payload = await res.json();
      } catch {
        payload = null;
      }

      if (!res.ok) {
        const apiMessage = getApiErrorMessage(payload);

        if (res.status === 402) {
          throw new Error(
            apiMessage ??
              "Payment required (402): backend billing or credits issue.",
          );
        }

        throw new Error(apiMessage ?? `Request failed with status ${res.status}.`);
      }

      if (!isAnalyzeResponse(payload)) {
        throw new Error("API returned unexpected response format.");
      }

      setProgress(100);
      setResult(payload);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to analyze food image.";
      setError(message);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const dishTitle = useMemo(() => {
    if (!result || result.foods.length === 0) return "Meal Analysis";
    const names = result.foods.slice(0, 2).map((food) => food.name);
    return names.join(" with ");
  }, [result]);

  const totalCalories = result?.total_calories ?? 0;
  const servingCalories = totalCalories * servings;
  const macroEstimate = useMemo(() => {
    if (!servingCalories) return { protein: 0, carbs: 0, fats: 0 };

    const protein = Math.round((servingCalories * 0.3) / 4);
    const carbs = Math.round((servingCalories * 0.4) / 4);
    const fats = Math.round((servingCalories * 0.3) / 9);

    return { protein, carbs, fats };
  }, [servingCalories]);

  const handleDone = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
    setResult(null);
    setServings(1);
    setProgress(0);
    setError("");
  };

  return (
    <div className="mx-auto mt-3 w-full max-w-[1400px] px-2 md:px-3">
      <style>{shimmerStyles}</style>
      <section className="rounded-[30px] border border-[#d7dbe2] bg-[#f7f8fb] p-3 shadow-[0_24px_60px_rgba(20,25,35,0.12)] sm:p-5">
        <div className="grid items-start gap-4 xl:grid-cols-[1.2fr_1fr]">
          <div className="self-start overflow-hidden rounded-[28px] border border-[#d7dbe2] bg-[#e8ecf3]">
            <div className="relative">
              {preview ? (
                <img
                  src={preview}
                  alt="Food preview"
                  className="h-[190px] w-full object-cover object-center sm:h-[240px] lg:h-[280px] xl:h-[310px]"
                />
              ) : (
                <div className="flex h-[190px] w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_25%_25%,#f6f7fb,#e8ecf3_55%,#d9e0ea)] text-[#5f6774] sm:h-[240px] lg:h-[280px] xl:h-[310px]">
                  <p className="text-lg font-semibold">Upload meal photo</p>
                  <p className="mt-1 text-sm">Your preview appears here</p>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-5 pb-5 pt-12">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-[#141820] shadow-md transition hover:bg-white">
                    {image ? "Change photo" : "Choose photo"}
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={loading || !image}
                    className="rounded-full bg-[#1b1d26] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#282b35] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Analyzing..." : "Scan Meal"}
                  </button>
                </div>

                {loading && (
                  <div className="mt-3 rounded-xl bg-black/35 p-2 backdrop-blur-[2px]">
                    <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-white/90">
                      <span>Analyzing meal...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/30">
                      <div
                        className="relative h-full overflow-hidden rounded-full bg-white transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      >
                        <span
                          className="absolute inset-y-0 left-[-35%] w-[35%] bg-gradient-to-r from-transparent via-[#6C6B6A] to-transparent"
                          style={{ animation: "food-progress-shine 2.5s linear infinite" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="rounded-[28px] border border-[#d7dbe2] bg-white p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="max-w-[75%] text-xl font-semibold leading-tight text-[#11131a] sm:text-2xl">
                {dishTitle}
              </h2>
              <div className="inline-flex items-center gap-4 rounded-full border border-[#d8dbe2] bg-[#f6f7fb] px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => setServings((prev) => Math.max(1, prev - 1))}
                  className="text-lg leading-none text-[#555e6d]"
                  aria-label="Decrease servings"
                >
                  -
                </button>
                <span className="min-w-4 text-center text-sm font-semibold text-[#1c2230]">
                  {servings}
                </span>
                <button
                  type="button"
                  onClick={() => setServings((prev) => Math.min(9, prev + 1))}
                  className="text-lg leading-none text-[#555e6d]"
                  aria-label="Increase servings"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[#f3f5f8] px-4 py-3">
              <p className="text-sm text-[#606a79]">Calories</p>
              <p className="text-4xl font-bold leading-tight text-[#11131a]">
                {servingCalories || "--"}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <MacroCard label="Protein" value={`${macroEstimate.protein}g`} />
              <MacroCard label="Carbs" value={`${macroEstimate.carbs}g`} />
              <MacroCard label="Fats" value={`${macroEstimate.fats}g`} />
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1c2230]">Ingredients</h3>
                <button
                  type="button"
                  className="text-sm font-medium text-[#737f92]"
                  disabled
                >
                  + Add more
                </button>
              </div>

              <div className="space-y-2">
                {result?.foods?.length ? (
                  result.foods.map((food, index) => (
                    <article
                      key={`${food.name}-${index}`}
                      className="flex items-center justify-between rounded-xl border border-[#e3e6ec] bg-[#fafbfe] px-3 py-2.5"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#171b25]">{food.name}</p>
                        <p className="text-xs text-[#70798a]">{food.calories} cal</p>
                      </div>
                      <p className="text-sm text-[#5d6574]">
                        {food.estimated_weight_grams} g
                      </p>
                    </article>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-[#d2d8e2] bg-[#f8f9fc] px-3 py-6 text-center text-sm text-[#788395]">
                    Analyze a meal to show ingredient rows.
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-xl border border-[#f3c9cc] bg-[#fff3f4] px-3 py-2 text-sm text-[#ae1d2f]">
                {error}
              </p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleUpload}
                disabled={loading || !image}
                className="rounded-full border border-[#d8dbe2] bg-[#f7f8fb] px-4 py-2.5 text-sm font-semibold text-[#1c2230] transition hover:bg-[#eef1f6] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Fixing..." : "Fix Results"}
              </button>
              <button
                type="button"
                onClick={handleDone}
                className="rounded-full bg-[#1b1d26] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2a2d37]"
              >
                Done
              </button>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

const shimmerStyles = `
@keyframes food-progress-shine {
  0% { transform: translateX(0); }
  100% { transform: translateX(420%); }
}
`;

type MacroCardProps = {
  label: string;
  value: string;
};

function MacroCard({ label, value }: MacroCardProps) {
  return (
    <div className="rounded-xl border border-[#e2e6ee] bg-[#f7f9fc] px-3 py-2 text-center">
      <p className="text-xs text-[#788395]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#1a202d]">{value}</p>
    </div>
  );
}
