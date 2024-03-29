import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

function About() {
  return (
    <>
      <div className="flex flex-col min-h-screen  bg-gray-100">
        <Navbar />

        <div className="flex-grow mt-14">
          <div className="container mx-auto py-8 px-4">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl md:text-4xl font-bold mb-4">
                  Introduction:
                </h1>
                <p className="text-base md:text-lg">
                  Welcome to our revolutionary web application – the ultimate
                  solution for seamlessly converting Audio formats.
                  Our platform offers a hassle-free experience, supporting most of the
                  audio formats for conversion into high-quality audio files.
                  With a user-friendly interface and powerful conversion
                  technology, we ensure that your audio format conversion
                  needs are met efficiently and effectively.
                </p>
              </div>

              <div className="mb-8">
                <h1 className="text-2xl md:text-4xl font-bold mb-4">
                  Endless Usage, No Obligations:
                </h1>
                <p className="text-base md:text-lg">
                  In contrast to other platforms, we champion your creative
                  freedom without any concealed charges or limitations. Feel
                  free to convert an unlimited number of audios to your heart's
                  content, all without spending a penny.
                </p>
              </div>

              <div className="mb-8">
                <h1 className="text-2xl md:text-4xl font-bold mb-4">
                  Available Everywhere:
                </h1>
                <p className="text-base md:text-lg">
                  You can utilize our Online Audio Format Converter Web-app from any device connected to the
                  internet. Whether you're using a computer, tablet, or
                  smartphone, accessing our platform is effortless.
                </p>
              </div>

              <div className="mb-8">
                <h1 className="text-2xl md:text-4xl font-bold mb-4">
                  Protected and Confidential:
                </h1>
                <p className="text-base md:text-lg">
                  Feel assured that your multimedia assets are handled with the
                  highest level of attention. We prioritize the security of
                  your data and privacy, guaranteeing that your files are kept
                  exclusively yours.
                </p>
              </div>

              <div className="mb-8">
                <h1 className="text-2xl md:text-4xl font-bold mb-4">
                  Contact Us
                </h1>
                <p className="text-base md:text-lg">
                  If you are facing any problems or have any queries feel free
                  to contact us at ranaarslanshahbaz@gmail.com.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default About;
