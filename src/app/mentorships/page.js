import React from 'react'
import Image from 'next/image'

const mentors = [
  {
    id: 1,
    name: 'Dr. Ayesha Khan',
    title: 'Cardiologist, SKIMS Srinagar',
    bio: 'Raised in Baramulla, Dr. Khan pursued medicine and now mentors students aspiring for NEET and medical careers.',
    avatar: 'https://i.pravatar.cc/600?img=47',
    email: 'ayesha.khan@example.com',
    rating: 4.9
  },
  {
    id: 2,
    name: 'Prof. Rahul Sharma',
    title: 'Professor of Computer Science, JU',
    bio: 'From Jammu, Prof. Sharma is passionate about guiding students in software engineering and research careers.',
    avatar: 'https://i.pravatar.cc/600?img=12',
    email: 'rahul.sharma@example.com',
    rating: 4.8
  },
  {
    id: 3,
    name: 'IAS Meera Qadri',
    title: 'Indian Administrative Service',
    bio: 'Hailing from Anantnag, Meera mentors UPSC aspirants with a focus on strategy, consistency, and well-being.',
    avatar: 'https://i.pravatar.cc/600?img=5',
    email: 'meera.qadri@example.com',
    rating: 4.9
  },
  {
    id: 4,
    name: 'Er. Adil Mir',
    title: 'Structural Engineer, Srinagar',
    bio: 'An NIT Srinagar alumnus, Adil helps students with GATE prep, core engineering careers, and portfolios.',
    avatar: 'https://i.pravatar.cc/600?img=33',
    email: 'adil.mir@example.com',
    rating: 4.7
  },
  {
    id: 5,
    name: 'Dr. Kiran Gupta',
    title: 'Psychologist, Jammu',
    bio: 'Guides students on stress management, exam preparation mindset, and holistic growth.',
    avatar: 'https://i.pravatar.cc/600?img=52',
    email: 'kiran.gupta@example.com',
    rating: 4.8
  },
  {
    id: 6,
    name: 'Ar. Sana Wani',
    title: 'Architect, Srinagar',
    bio: 'Mentors design portfolios, NATA/JEE B.Arch prep, and studio readiness.',
    avatar: 'https://i.pravatar.cc/600?img=15',
    email: 'sana.wani@example.com',
    rating: 4.6
  },
  {
    id: 7,
    name: 'Lt. Col. Vivek Singh',
    title: 'Indian Army (Retd.)',
    bio: 'Advises on SSB preparation, discipline building, and defense careers.',
    avatar: 'https://i.pravatar.cc/600?img=67',
    email: 'vivek.singh@example.com',
    rating: 4.8
  },
  {
    id: 8,
    name: 'C.A. Nida Bashir',
    title: 'Chartered Accountant, Jammu',
    bio: 'Helps with CA Foundation/Inter strategy and finance careers.',
    avatar: 'https://i.pravatar.cc/600?img=25',
    email: 'nida.bashir@example.com',
    rating: 4.9
  }
]

const MentorCard = ({ mentor }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-800/70 backdrop-blur-sm shadow-xl transition transform hover:-translate-y-1 hover:shadow-2xl">
      <div className="absolute right-3 top-3">
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#F39C12] text-white shadow">
          {mentor.rating.toFixed(1)}+
        </span>
      </div>
      <div className="flex flex-col items-center pt-8 px-5 pb-5">
        <div className="relative w-28 h-28 -mt-2">
          <Image
            src={mentor.avatar}
            alt={mentor.name}
            fill
            className="rounded-full object-cover ring-4 ring-[#F39C12]/60"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h3 className="mt-4 text-lg font-extrabold text-white text-center">{mentor.name}</h3>
        <p className="text-sm text-[#F39C12] font-semibold text-center">{mentor.title}</p>
        <p className="text-slate-300 mt-3 leading-relaxed text-sm min-h-16 text-center">{mentor.bio}</p>
        <div className="mt-5 w-full flex flex-col items-center gap-3">
          <a href={`mailto:${mentor.email}`} className="text-xs text-slate-300 hover:text-white underline underline-offset-4">
            {mentor.email}
          </a>
          <button className="text-sm bg-[#F39C12] hover:bg-[#d7890f] text-white rounded-xl px-4 py-2 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F39C12]/70 focus:ring-offset-slate-900">
            Schedule a Meeting
          </button>
        </div>
      </div>
    </div>
  )
}

const page = () => {
  return (
    <section className="px-6 py-12 md:py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 md:mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Connect with Expert Mentors
          </h1>
          <p className="mt-4 text-slate-300 max-w-3xl mx-auto">
            Get personalized guidance from experienced professionals across various fields. Book one-on-one sessions to accelerate your career journey.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-7">
          {mentors.map((m) => (
            <MentorCard key={m.id} mentor={m} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default page
