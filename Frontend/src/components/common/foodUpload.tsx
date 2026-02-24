import { useMemo, useState, type ChangeEvent } from "react";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!image) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await fetch("http://localhost:5000/analyze-food", {
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

      setResult(payload);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to analyze food image.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const foodCount = result?.foods.length ?? 0;
  const averageCalories = useMemo(() => {
    if (!result || result.foods.length === 0) return 0;
    return Math.round(result.total_calories / result.foods.length);
  }, [result]);

  return (
    <div className="mx-auto mt-3 w-full max-w-[1400px] px-2 md:px-3">
      <section className="font-body w-full overflow-hidden rounded-2xl border border-[#e5e7eb] bg-gradient-to-b from-[#f8fafc] via-[#f3f4f6] to-[#eef2f7] p-3 shadow-md sm:p-4">
        <div className="relative mb-4 overflow-hidden rounded-2xl border border-[#dbe1ea] bg-white px-4 py-4 sm:px-5 sm:py-5">
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#e2e8f0] blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-[#dbeafe] blur-2xl" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="mb-2 inline-flex rounded-full border border-[#d1d5db] bg-[#f8fafc] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748b]">
                Smart Nutrition
              </p>
              <h2 className="font-display text-lg font-semibold text-[#0f172a] sm:text-xl">
                Food Analyzer
              </h2>
              <p className="mt-1 text-sm text-[#64748b]">
                Upload your meal photo to get an instant calorie estimate with item-wise nutrition breakdown.
              </p>
            </div>
            <p className="rounded-full border border-[#d1d5db] bg-[#f8fafc] px-3 py-1 text-xs font-semibold text-[#334155]">
              AI Vision
            </p>
          </div>
        </div>

        <div className="mb-4 grid gap-2.5 sm:grid-cols-3">
          <StatCard label="Items Detected" value={foodCount.toString()} />
          <StatCard
            label="Total Calories"
            value={result ? `${result.total_calories} kcal` : "--"}
          />
          <StatCard
            label="Avg Calories / Item"
            value={result ? `${averageCalories} kcal` : "--"}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-4">
            <div className="rounded-2xl border border-[#d8dee8] bg-white p-3.5 shadow-sm sm:p-4">
              <h3 className="font-display text-sm font-semibold text-[#0f172a] sm:text-base">
                Upload Meal Image
              </h3>
              <p className="mt-1 text-xs text-[#64748b] sm:text-sm">
                Use a clear top view image for better analysis.
              </p>

              <label className="mt-3 block cursor-pointer rounded-2xl border-2 border-dashed border-[#cbd5e1] bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] p-6 text-center transition hover:border-[#94a3b8] hover:from-[#f1f5f9] hover:to-[#eef2ff]">
                <span className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-[#0f172a] text-lg font-bold text-white shadow-sm">
                  ↑
                </span>
                <span className="block text-sm font-semibold text-[#0f172a]">
                  Click to choose image
                </span>
                <span className="mt-1 block text-xs text-[#64748b]">
                  JPG, PNG, WEBP supported
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>

              {image && (
                <p className="mt-2 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-xs text-[#475569]">
                  Selected: {image.name}
                </p>
              )}

              <button
                onClick={handleUpload}
                disabled={loading || !image}
                className="mt-3 h-11 w-full rounded-xl bg-gradient-to-r from-[#0f172a] to-[#1e293b] px-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Analyzing image..." : "Analyze Food"}
              </button>

              {error && (
                <p className="mt-3 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-sm text-[#b91c1c]">
                  {error}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3 lg:col-span-8">
            <div className="rounded-2xl border border-[#d8dee8] bg-white p-3.5 shadow-sm sm:p-4">
              <h3 className="font-display text-sm font-semibold text-[#0f172a] sm:text-base">
                Preview
              </h3>
              <div className="mt-3 overflow-hidden rounded-xl border border-[#e2e8f0] bg-[#f8fafc]">
                {preview ? (
                  <img
                    src={preview}
                    alt="Food preview"
                    className="h-60 w-full object-cover sm:h-72 lg:h-[320px]"
                  />
                ) : (
                  <div className="flex h-60 w-full flex-col items-center justify-center gap-1 text-sm text-[#94a3b8] sm:h-72 lg:h-[320px]">
                    <span className="text-base font-semibold text-[#64748b]">No image selected</span>
                    <span className="text-xs">Upload a meal photo to see preview</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[#d8dee8] bg-white p-3.5 shadow-sm sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-sm font-semibold text-[#0f172a] sm:text-base">
                  Nutrition Breakdown
                </h3>
                {result && (
                  <span className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-xs font-semibold text-[#4338ca]">
                    {result.foods.length} items
                  </span>
                )}
              </div>

              {!result && (
                <div className="mt-3 rounded-xl border border-dashed border-[#d1d5db] bg-[#f8fafc] px-4 py-6 text-sm text-[#64748b]">
                  Analysis results will appear here after upload.
                </div>
              )}

              {result && (
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {result.foods.map((food: FoodItem, index: number) => (
                    <article
                      key={`${food.name}-${index}`}
                      className="rounded-xl border border-[#e2e8f0] bg-gradient-to-b from-[#ffffff] to-[#f8fafc] px-3.5 py-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-[#111827] sm:text-base">
                          {food.name}
                        </h4>
                        <span className="rounded-full bg-[#e2e8f0] px-2.5 py-1 text-xs font-medium text-[#1e293b]">
                          {food.calories} kcal
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#64748b] sm:text-sm">
                        Estimated weight: {food.estimated_weight_grams} g
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-[#dbe1ea] bg-white px-3.5 py-3 shadow-sm">
      <p className="text-[11px] uppercase tracking-[0.14em] text-[#64748b]">{label}</p>
      <p className="mt-1.5 font-display text-xl font-bold text-[#0f172a]">{value}</p>
    </div>
  );
}
