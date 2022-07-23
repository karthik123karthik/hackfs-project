import Link from "next/link"

export default function Gig(){
    return(
      <Link href="/gigs/smartcontract">
       <div className="gig-Card m-2 flex flex-col  w-[35vw]  h-[75vh] bg-indigo-100">
            <div className="profile-part h-[80%] ">
               <div className="bg-red-800 h-[50%]"></div>
                <div className="flex flex-row  p-3">
                  <img src="./favicon.ico" className="w-[40px] mr-3"></img>
                   <div className="flex flex-col">
                   <strong>karthik G K</strong>
                   <strong className="text-[#D6BC01]">Top Seller</strong>
                   </div>
                </div>
                <div className="text-xl p-2 hover:text-lime-600">
                  I will do best Smart contract design according to your requirements
                </div>
            </div>
            <div className="rating-part h-[20%]  flex flex-row items-center justify-between  p-3">
                <img src="./heart.png" className="w-[40px]"></img>
                <div className="text-lime-900 text-sm">
                   <strong> Starting at Rupees</strong>
                   <p>20 USD</p>
                </div>
            </div>
       </div>
       </Link>
    )
}