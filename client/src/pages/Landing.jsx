import {
  ArrowRight,
  Dumbbell,
  Apple,
  Brain,
  Flower2,
  HeartPulse,
  Play,
  Users,
  BookOpen,
  Mic2,
  Sparkles,
} from "lucide-react";

import Navbar from "../components/Navbar";

const categories = [
  { name: "Fitness", icon: Dumbbell },
  { name: "Nutrition", icon: Apple },
  { name: "Mental Health", icon: Brain },
  { name: "Yoga", icon: Flower2 },
  { name: "Wellness", icon: HeartPulse },
];

function Landing() {
  return (
    <div className="min-h-screen bg-[#f7faf8]">

      <Navbar />

      {/* HERO */}
      <section
        id="home"
        className="relative overflow-hidden"
      >
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-green-100 blur-3xl" />

        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-emerald-100 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">

          {/* LEFT */}
          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              <Sparkles size={16} />
              Your healthier journey starts here
            </div>

            <h1 className="max-w-xl text-5xl font-bold leading-tight text-gray-900 sm:text-6xl">

              Your Health.
              <br />

              <span className="text-green-600">
                Your Story.
              </span>

              <br />

              Together.
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">
              Discover, learn and grow with a community
              committed to your health and well-being.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <button className="group flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-green-600/20 hover:bg-green-700">
                Get Started

                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <button className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-semibold text-gray-700 shadow-sm hover:border-green-200 hover:text-green-700">

                <Play size={17} className="fill-current" />

                Watch Video
              </button>

            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="mx-auto w-full max-w-lg">

            <div className="overflow-hidden rounded-[2rem] border border-white bg-gradient-to-br from-green-100 via-white to-emerald-50 p-5 shadow-2xl">

              <div className="flex aspect-square items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-green-50 to-emerald-100">

                <div className="text-center">

                  <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-green-200/70">

                    <HeartPulse
                      size={90}
                      strokeWidth={1.2}
                      className="text-green-700"
                    />

                  </div>

                  <p className="mt-6 text-xl font-bold text-green-800">
                    A Healthier, Happier You
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Learn • Discover • Grow
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-green-100 bg-white">

        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">

          <Stat
            icon={BookOpen}
            number="10K+"
            label="Health Articles"
          />

          <Stat
            icon={Mic2}
            number="5K+"
            label="Podcasts"
          />

          <Stat
            icon={Users}
            number="2K+"
            label="Creators"
          />

          <Stat
            icon={HeartPulse}
            number="50K+"
            label="Active Users"
          />

        </div>

      </section>

      {/* EXPLORE */}
      <section
        id="explore"
        className="mx-auto max-w-7xl px-5 py-16 lg:px-8"
      >

        <div className="mb-8">

          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-green-600">
            Explore
          </p>

          <h2 className="text-3xl font-bold text-gray-900">
            Explore What Matters to You
          </h2>

          <p className="mt-2 text-gray-500">
            Find content that matches your interests.
          </p>

        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">

          {categories.map((category) => {

            const Icon = category.icon;

            return (
              <button
                key={category.name}
                className="group flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
              >

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 group-hover:bg-green-100">

                  <Icon
                    size={25}
                    className="text-green-600"
                  />

                </div>

                <span className="text-sm font-semibold text-gray-700">
                  {category.name}
                </span>

              </button>
            );

          })}

        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="bg-green-900 px-5 py-16 text-white"
      >

        <div className="mx-auto max-w-3xl text-center">

          <p className="text-sm font-bold uppercase tracking-wider text-green-300">
            Healthora
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Your health journey, personalized.
          </h2>

          <p className="mt-4 leading-7 text-green-100">
            Explore trusted health content, discover new ideas,
            and build a learning journey around what matters
            most to you.
          </p>

        </div>

      </section>

    </div>
  );
}

function Stat({ icon: Icon, number, label }) {
  return (
    <div className="flex items-center justify-center gap-3 border-r border-gray-100 px-4 py-7 last:border-r-0">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
        <Icon size={20} className="text-green-600" />
      </div>

      <div>
        <p className="font-bold text-gray-900">
          {number}
        </p>

        <p className="text-xs text-gray-500">
          {label}
        </p>
      </div>

    </div>
  );
}

export default Landing;