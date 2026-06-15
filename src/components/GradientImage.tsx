function GradientImage() {
  return (
     <div className="relative hidden md:block md:w-1/2 bg-white h-[700px] mb-2 mt-2 rounded-2xl  overflow-hidden">
        <div className="absolute bottom-[250px]  left-[-30px]  h-[800px] w-[800px] rounded-full bg-[#1F1FE0] opacity-100 blur-[70px]"  />
        <div className="absolute bottom-[450px]  left-[-30px] h-[800px] w-[800px] rounded-full bg-black opacity-100 blur-[40px]" />
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