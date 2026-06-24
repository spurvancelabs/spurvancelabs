import React from 'react'

function GetStarted() {
  return (
     <div className="mt-20 text-center">
          <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-white text-[2rem] font-bold mb-6">
              Ready to Start Your Journey?
            </h3>
            <p className="text-[#666] text-[1.1rem] mb-8 max-w-2xl mx-auto">
              Submit your application with your resume, portfolio, and a cover letter explaining why you&apos;d be a great fit for our team.
            </p>
            <button className="inline-flex items-center gap-3 px-10 py-4 bg-blue-500 text-white rounded-full font-medium cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(59,130,246,0.3)]">
              <span>Apply Now</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
  )
}

export default GetStarted