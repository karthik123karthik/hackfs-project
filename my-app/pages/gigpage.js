

export default function Gig(){
    return(
       <div className="gig-Card border w-[25vw] h-[60vh]">
         <div className="gig-intro border bg-[url(https://source.unsplash.com/random)] bg-cover h-[50%]">
           
         </div>
         <div className="gigcreator-intro border h-[30%]">
            <section className="profile-section border h-[20%]"></section>
            <section className="service-section border h-[60%]"></section>
            <section className="rating-section border h-[20%]"></section>
         </div>
         <div className="gig-pricing flex justify-between border h-[20%]">
             <div className="heart border w-[20%]"></div>
             <div className="price border w-[30%]"></div>
         </div>
       </div>
    )
}