"use client"
import Image from "next/image";
import bg from "../public/images/herosection/bg.png"
import bg2 from "../public/images/herosection/signup.png"
import shoe1 from "../public/images/all-shoes/shoe1.png"
import shoe2 from "../public/images/all-shoes/shoe2.png"
import shoe3 from "../public/images/all-shoes/shoe3.png"
import shoe4 from "../public/images/all-shoes/shoe4.png"
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

  return (
    <>
      <section className="relative w-full overflow-hidden h-[500px] md:h-[500px]">
        <div className="block">
          <Image
            src={bg}
            alt="Hero Background"
            fill
            priority
            className="object-cover object-top z-0"
          />
        </div>
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center py-16 md:py-32 px-4 md:px-6 h-full">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 px-2">
            Be Outside. Comfy All day.
          </h1>
          <button className="px-4 md:px-6 py-2 md:py-3 bg-white text-black rounded-md font-medium hover:bg-gray-200 transition text-sm md:text-base" onClick={() => router.push("/products")}>
            Shop sustainable outdoor footwear.
          </button>
        </div>
      </section>

  {/* New Product Grid Section */}
  <section className="bg-gray-50 py-8 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-700 text-center mb-8 md:mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-32 sm:h-40 md:h-48">
                <Image
                  src={shoe1}
                  alt="Rain Boot"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-semibold text-base md:text-lg">Rain Boot</h3>
                <p className="text-gray-600 text-xs md:text-sm mb-2">Waterproof and comfortable for rainy days</p>
                <p className="font-bold text-green-600 text-sm md:text-base">$89.99</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-32 sm:h-40 md:h-48">
                <Image
                  src={shoe2}
                  alt="Snow Boot"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-semibold text-base md:text-lg">Snow Boot</h3>
                <p className="text-gray-600 text-xs md:text-sm mb-2">Warm and insulated for winter weather</p>
                <p className="font-bold text-green-600 text-sm md:text-base">$129.99</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-32 sm:h-40 md:h-48">
                <Image
                  src={shoe3}
                  alt="Sun Sandal"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-semibold text-base md:text-lg">Sun Sandal</h3>
                <p className="text-gray-600 text-xs md:text-sm mb-2">Lightweight and breathable for summer</p>
                <p className="font-bold text-green-600 text-sm md:text-base">$59.99</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-32 sm:h-40 md:h-48">
                <Image
                  src={shoe4}
                  alt="All Weather"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-semibold text-base md:text-lg">All Weather</h3>
                <p className="text-gray-600 text-xs md:text-sm mb-2">Versatile footwear for any condition</p>
                <p className="font-bold text-green-600 text-sm md:text-base">$99.99</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* next best thing to walking barefoot */}
      <section className="relative py-8 md:py-16 bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={bg2}
            alt="best thing to walking barefoot"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4 md:mb-6">
            The next best thing to walking barefoot.
          </h2>
          <p className="text-gray-200 dark:text-gray-100 mb-8 md:mb-10 max-w-2xl mx-auto text-base md:text-lg px-2 drop-shadow-md">
            Discover the amazing features that make our platform stand out. Sign up today to experience the difference!
          </p>
        </div>
      </section>

       {/* choose us */}
       <section className="bg-white py-8 md:py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-white mb-4">
            Why Choose Us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            <div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <svg
                className="w-8 h-8 md:w-12 md:h-12 mx-auto text-blue-600 dark:text-blue-400 mb-3 md:mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Easy Signup
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Get started in minutes with our simple and secure signup process.
              </p>
            </div>
            <div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <svg
                className="w-8 h-8 md:w-12 md:h-12 mx-auto text-green-600 dark:text-green-400 mb-3 md:mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823.922-4"
                />
              </svg>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Enjoy peace of mind with our top-notch payment security.
              </p>
            </div>
            <div className="p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
              <svg
                className="w-8 h-8 md:w-12 md:h-12 mx-auto text-yellow-600 dark:text-yellow-400 mb-3 md:mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823.922-4"
                />
              </svg>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                24/7 Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                Our team is here to help you anytime, day or night.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}





