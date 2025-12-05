"use client"
import { React } from 'react'
import { Image } from 'next/image'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiagramProject } from "@fortawesome/free-solid-svg-icons";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faBuildingColumns } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';

const Hero = () => {
    const navLinks = [
        { href: "/", text: "Home" },
        { },
        { },
        { },
        {  }
    ];
    const QuizAI = () => (
        <FontAwesomeIcon icon={faCircleCheck} className="text-[#F39C12] text-4xl mx-auto mb-4" />
    );

    const MentorshipIcon = () => (
        <FontAwesomeIcon icon={faUsers} className="text-[#F39C12] text-4xl mx-auto mb-4" />
    );

    const Flowcharts = () => (
        <FontAwesomeIcon icon={faDiagramProject} className="text-[#F39C12] text-4xl mb-4" />
    );

    const Colleges = () => (
        <FontAwesomeIcon icon={faBuildingColumns} className="text-[#F39C12] text-4xl mx-auto mb-4" />
    );
    const Scholarships = () => (
        <FontAwesomeIcon icon={faCoins} className="text-[#F39C12] text-4xl mb-4" />
    );
    const Databank = () => (
        <FontAwesomeIcon icon={faDatabase} className="text-[#F39C12] text-4xl mx-auto mb-6" />
    );

    const features = [
        {
            icon: <QuizAI />,
            title: 'QuizAI',
            description: 'Take our AI-powered quiz to discover personalized career paths that match your unique interests and skills.',
            btn: 'Start Quiz',
            href: "/QuizAi", text: "QuizAI"
        },
        {
            icon: <MentorshipIcon />,
            title: 'Mentorship Network',
            description: 'Connect with experienced professionals and mentors from various fields for one-on-one guidance and support.',
            btn: 'Find a Mentor',
            href: "/mentorships", text: "Mentorships" 
        },
        {
            icon: <Flowcharts />,
            title: 'Career Flowcharts',
            description: 'Visualize your career journey with interactive flowcharts that map out every step from education to employment.',
            btn: 'Explore Paths',
            href: "/Flowcharts", text: "Flowcharts" 
        },
        {
            icon: <Colleges />,
            title: 'Find Nearby Colleges',
            description: 'Discover and compare colleges and universities in your area that offer the courses you are passionate about.',
            btn: 'Search Colleges',
            href: "/colleges", text: "Colleges" 

        },
        {
            icon: <Scholarships />,
            title: 'Scholarships & Financial Aids',
            description: 'Access a curated database of scholarships, grants, and financial aid opportunities to fund your education.',
            btn: 'View Scholarships',
            href: "/scholarships", text: "Scholarships" 
        },
        {
            icon: <Databank />,
            title: 'Career Databanks',
            description: 'Access comprehensive data on various career profiles, industry trends, and salary expectations to make informed decisions.',
            btn: 'Access Data',
            href: "/resources", text: "Resources" 
        },
    ];

    return (<>
        <section className="relative h-screen w-full flex items-center justify-center hero mb-0">
            <div className="absolute inset-0 w-full h-full">
                <img
                    src="/background1.jpg"
                    alt="A scenic view of mountains and a lake, representing opportunity."
                    className="absolute inset-0 w-full h-full object-cover -z-10"
                />
                <div className="absolute inset-0 bg-black opacity-50 z-10 w-full h-full" />
            </div>

            <div className="relative z-10 text-center p-5">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    <p>Unlock Your Future,</p>
                    <p>Rooted in J&K</p>
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                    Personalized career guidance for the youth of India.
                </p>
                <Link href="/QuizAi">
                <button className="bg-[#F39C12] hover:bg-opacity-90 font-bold py-3 px-8 rounded-full text-lg transition duration-300 transform hover:scale-105">
                    Take Assessment
                    <i className="pl-2 fa-solid fa-arrow-right"></i>
                </button></Link>
            </div>

        </section>
        <div className="bg-[#0F172A] sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-slate-800/70 backdrop-blur-sm p-8 rounded-lg border border-slate-700/50 shadow-xl text-center transform hover:-translate-y-1 transition-transform duration-300">
                            {feature.icon}
                            <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                            <p className="text-slate-300 mt-2 text-sm">{feature.description}</p>
                            <Link href={feature.href}><button className='text-white font-bold mt-5 p-3 bg-[#F39C12] hover:bg-[#d7890f] rounded-full hover:cursor-pointer transition-colors'>{feature.btn}<i className="px-2 fa-solid fa-arrow-right"></i></button></Link>
                        </div>
                    ))}
                </div>
            </div>
        </div></>
    );
}

export default Hero;