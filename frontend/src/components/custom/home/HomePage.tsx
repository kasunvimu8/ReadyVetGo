import { Button } from "@/components/ui/button"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/lib/store"
import { openSheet } from "@/types/sheetAction.ts"
import BlogpostCard from "@/components/custom/blogpost-card/BlogpostCard"
import { Card, CardDescription, CardHeader } from "@/components/ui/card.tsx"
import { BsFileEarmarkMedicalFill } from "react-icons/bs"
import { FaUserDoctor } from "react-icons/fa6"
import { RiArticleFill } from "react-icons/ri"
import { MdVerified } from "react-icons/md"
import { TbHealthRecognition, TbPigMoney } from "react-icons/tb"
import { PiFlowerLotusLight } from "react-icons/pi"
import { Avatar, AvatarImage } from "@/components/ui/avatar.tsx"
import { FaLinkedin } from "react-icons/fa"
import HomeSection from "@/components/custom/home/HomeSection.tsx"

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>()

  const handleOpenregisterAsFarmerSheet = () => {
    dispatch(openSheet("registerAsClient"))
  }

  return (
    <>
      {/* Header presenting ready-vet-go */}
      <div
        className="flex flex-col-reverse md:flex-row items-center relative"
        style={{
          background:
            "linear-gradient(45deg, rgba(55,114,91,0.2) 0%, rgba(18,42,65,0.2) 100%)",
        }}
      >
        <img
          src="/header-cow.png"
          alt="image of a cow"
          className="absolute bottom-0 left-0 opacity-50 md:opacity-100 md:static h-full md:w-1/3 pt-8 [filter:saturate(1.5)grayscale(1)] select-none mt-auto object-bottom object-contain"
        />

        <div className="flex flex-col w-full items-center m-2 z-5 p-8">
          <img
            src="/Logo.png"
            alt="Ready Vet Go's Logo"
            className="w-full max-w-[60vw] md:max-w-[50vw] px-16"
          />
          <p className="text-4xl md:max-w-[40vw] font-thin p-4 pt-8 text-center text-[#122A41]">
            Expert veterinary advice for farmers, just a click away
          </p>
          <Button
            className="bg-[#122A41] font-light px-8 py-4 text-lg"
            onClick={handleOpenregisterAsFarmerSheet}
          >
            Try it out!
          </Button>
          <p className="text-gray-500 font-light px-4 mt-2 text-center">
            Are you a veterinarian looking to join our team?{" "}
            <a href="/blog/veterinarian" className="underline">
              Learn more.
            </a>
          </p>
        </div>
      </div>

      {/* Our services */}
      <HomeSection title="Our Services" variant="dark">
        <div className="flex flex-col md:flex-row gap-4 mt-8 text-3xl justify-center font-thin">
          <Card className="w-full md:w-1/4 h-[350px] sm:h-[250px] md:h-[400px] bg-[#122A41] overflow-hidden relative border-0 text-white">
            <CardHeader className="block text-white/70">
              <span className="font-bold text-4xl text-white">Articles</span>{" "}
              about Animal's health
            </CardHeader>
            <RiArticleFill
              className="m-0 scale-[8]
               absolute bottom-[10%] left-[50%] translate-x-[-50%] opacity-50"
            />
          </Card>

          <Card className="w-full md:w-1/4 h-[350px] sm:h-[250px] md:h-[400px] bg-[#122A41] overflow-hidden relative border-0 text-white">
            <CardHeader className="block text-white/70">
              <span className="font-bold text-4xl text-white">
                Live support
              </span>{" "}
              by verified veterinarians{" "}
              <MdVerified className="translate-y-[-4px] translate-x-[-3px] inline scale-75" />
            </CardHeader>
            <FaUserDoctor
              className="m-0 scale-[7]
               absolute bottom-[15%] left-[50%] translate-x-[-50%] translate-y-[-50%] opacity-50"
            />
          </Card>

          <Card className="w-full md:w-1/4 h-[350px] sm:h-[250px] md:h-[400px] bg-[#122A41] overflow-hidden relative border-0 text-white">
            <CardHeader className="block text-white/70">
              <span className="font-bold text-4xl text-white">
                Medical record creation
              </span>{" "}
              with AI support
            </CardHeader>
            <BsFileEarmarkMedicalFill
              className="m-0 scale-[7.5]
               absolute bottom-[10%] left-[50%] translate-x-[-50%] opacity-50"
            />
          </Card>
        </div>
      </HomeSection>

      {/* Recent articles */}
      <HomeSection title="Recent Articles">
        <BlogpostCard />
      </HomeSection>

      {/* Live chat feature */}
      <HomeSection variant="dark" title="Live Chat Feature">
        <div className="gap-8 md:gap-0 flex flex-col-reverse md:flex-row items-center">
          <div className="flex flex-col items-center w-full md:w-1/2 gap-4">
            <p className="text-xl text-center mx-8 mb-8">
              With ReadyVetGo’s 24/7 instant chat feature, farmers can connect
              with veterinarians anytime, anywhere, ensuring immediate access to
              professional advice and support for their livestock.
            </p>

            <Card className="w-3/4 bg-[#122A41] overflow-hidden relative border-0 text-white">
              <TbHealthRecognition className="w-[50px] h-[50px] stroke-1 absolute right-0 top-0 m-2" />
              <CardHeader className="font-bold text-xl mr-5">
                Instant Access to Experts
              </CardHeader>
              <CardDescription className="text-white/70 px-6 pb-6">
                Get immediate advice and support from professional veterinarians
                anytime, anywhere. With our 24/7 chat feature, you can quickly
                address any health concerns, ensuring your livestock receive
                timely care.
              </CardDescription>
            </Card>

            <Card className="w-3/4 bg-[#122A41] overflow-hidden relative border-0 text-white">
              <TbPigMoney className="w-[50px] h-[50px] stroke-1 absolute right-0 top-0 m-2" />
              <CardHeader className="font-bold text-xl mr-5">
                Time and Cost Efficiency
              </CardHeader>
              <CardDescription className="text-white/70 px-6 pb-6">
                Save time and reduce costs by avoiding unnecessary travel for
                vet visits. Our instant chat feature allows you to get expert
                guidance without leaving your farm, making it convenient and
                economical.
              </CardDescription>
            </Card>

            <Card className="w-3/4 bg-[#122A41] overflow-hidden relative border-0 text-white">
              <PiFlowerLotusLight className="w-[50px] h-[50px] stroke-1 absolute right-0 top-0 m-2" />

              <CardHeader className="font-bold text-xl mr-5">
                Peace of Mind
              </CardHeader>
              <CardDescription className="text-white/70 px-6 pb-6">
                Experience the assurance that comes with having veterinary
                support always available. Whether it’s a minor question or an
                urgent issue, our chat feature ensures you have reliable
                assistance at your fingertips, enhancing the overall health and
                well-being of your livestock.
              </CardDescription>
            </Card>
          </div>
          <img
            src="Chat%20Farmer.png"
            alt="Chat conversation example"
            className="w-full md:w-1/2 rounded-xl shadow"
          />
        </div>
      </HomeSection>

      {/* Meet the developers */}
      <HomeSection title="Meet The Developers">
        <div className="md:flex grid grid-cols-2 md:flex-row gap-12 lg:gap-16">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px]">
              <AvatarImage src="/developers/Kasun-Kanaththage.png" />
            </Avatar>
            <p className="text-2xl text-center">
              Kasun Kanaththage{" "}
              <a href="https://www.linkedin.com/in/kasunvimu/" target="_blank">
                <FaLinkedin className="text-blue-800/80 inline translate-y-[-1px]" />
              </a>
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px]">
              <AvatarImage src="/developers/Sebastien-Letzelter.png" />
            </Avatar>
            <p className="text-2xl text-center">
              Sebastien Letzelter{" "}
              <a
                href="https://www.linkedin.com/in/s%C3%A9bastien-letzelter-76067a145/"
                target="_blank"
              >
                <FaLinkedin className="text-blue-800/80 inline translate-y-[-1px]" />
              </a>
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px]">
              <AvatarImage src="/developers/Simon-Graeber.png" />
            </Avatar>
            <p className="text-2xl text-center">
              Simon Graeber{" "}
              <a
                href="https://www.linkedin.com/in/simongraeber/"
                target="_blank"
              >
                <FaLinkedin className="text-blue-800/80 inline translate-y-[-1px]" />
              </a>
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Avatar className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px]">
              <AvatarImage src="/developers/Andrian-Naibaho.png" />
            </Avatar>
            <p className="text-2xl text-center">
              Andrian Naibaho{" "}
              <a
                href="https://www.linkedin.com/in/andrian-raja-naibaho/"
                target="_blank"
              >
                <FaLinkedin className="text-blue-800/80 inline translate-y-[-1px]" />
              </a>
            </p>
          </div>
        </div>
        <Card className="p-8 md:p-16 bg-white/30 my-16 text-xl w-full md:w-2/3 text-center">
          This app was created by four students as part of the{" "}
          <a
            className="underline text-blue-700"
            href="https://wwwmatthes.in.tum.de/pages/1mqqqoqe7gapz/Software-Engineering-for-Business-Applications-SEBA-Master"
            target="_blank"
          >
            SEBA master
          </a>{" "}
          course, at the{" "}
          <a
            className="underline text-blue-700"
            href="https://www.cit.tum.de/en/cit/home/"
            target="_blank"
          >
            Technical University of Munich
          </a>
          's School of Computation, Information, and Technology.
          <div className="flex flex-row justify-center mt-8">
            <a
              className="contents"
              href="https://www.cit.tum.de/en/cit/home/"
              target="_blank"
            >
              <img
                src="/TUM.png"
                alt="Logo of Technical University of Munich"
                className="object-contain [mix-blend-mode:multiply] w-[150px] sm:w-[200px] md:w-[300px]"
              />
            </a>
            <a
              className="contents"
              href="https://wwwmatthes.in.tum.de/pages/t5ma0jrv6q7k/sebis-Public-Website-Home"
              target="_blank"
            >
              <img
                src="/Sebis.png"
                alt="Logo of the Chair of Software Engineering for Business Information Systems"
                className="object-contain [mix-blend-mode:multiply] w-[100px] sm:w-[150px] md:w-[200px]"
              />
            </a>
          </div>
        </Card>
      </HomeSection>
    </>
  )
}

export default HomePage
