export const Contact = () => {
  return (
    <section id="contact" className="flex flex-col items-center pt-18 md:gap-10 md:ml-60 gap-4 pb-20 md:pt-10">

      <div className="flex gap-3 max-w-xs w-full">
        <img src="/static/instagram-logo-thin-svgrepo-com.svg" className="w-6" />
        <a href="/" className="text-1xl md:text-1xl text-gray-800 tracking-widest hover:text-gray-400 transition-colors">rickmakeup</a>
      </div> 

      <div className="flex gap-3 max-w-xs w-full">
        <img src="/static/email-logo.png" className="w-6" />
        <a href="/" className="text-gray-800 tracking-widest md:text-1xl hover:text-gray-400 transition-colors">rickmakeup@gmail.com</a>
      </div> 
    </section>
  )
}