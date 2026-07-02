function GradientImage() {
  return (
      <div className="relative hidden md:block md:w-1/2 bg-white h-screen max-h-[900px] min-h-[550px]   rounded-l-2xl overflow-hidden">
         <div className="absolute md:bottom-[150px] lg:bottom-[250px] md:left-[-80px] lg:left-[-30px] md:h-[500px] md:w-[500px] lg:h-[800px] lg:w-[800px] rounded-full bg-[#1F1FE0] opacity-100 blur-[50px] lg:blur-[70px]"  />
         <div className="absolute md:bottom-[300px] lg:bottom-[450px] md:left-[-80px] lg:left-[-30px] md:h-[500px] md:w-[500px] lg:h-[800px] lg:w-[800px] rounded-full bg-black opacity-100 blur-[30px] lg:blur-[40px]" />
       </div>
  )
}

export default GradientImage;




// function GradientImage() {
//   return (
//      <div className="relative hidden md:block md:w-1/2 bg-white md:min-h-screen rounded-xl">
//         <div className="absolute bottom-[200px] h-[500px] w-[500px] rounded-full bg-[#1F1FE0] opacity-100 blur-[70px]" />
//         <div className="absolute bottom-[350px] h-[500px] w-[500px] rounded-full bg-black opacity-100 blur-[40px]" />
//       </div>
//   )
// }

// export default GradientImage