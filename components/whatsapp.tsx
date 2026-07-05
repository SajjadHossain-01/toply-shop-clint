"use client";

import { useEffect, useState } from "react";

export default function WhatsAppChat() {
    const [open, setOpen] = useState(false);
    const [inputText, setInputText] = useState("");

    const phoneNumber = "+8801970467192";
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    // ইউজার যদি ইনপুটে কিছু না লেখে, তবে ডিফল্ট মেসেজ যাবে
    const defaultMessage = "আসসালামু আলাইকুম আমি জানতে চাই ....";
    const finalMessage = inputText.trim() || defaultMessage;
    const whatsappLink = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(finalMessage)}`;

    // ⏳ ৩ সেকেন্ড পর অটো পপআপ হবে
    // useEffect(() => {
    //     const timer = setTimeout(() => setOpen(true), 3000);
    //     return () => clearTimeout(timer);
    // }, []);

    return (
        <>
            {/* পপআপ চ্যাট বক্স */}
            <div
                className={`fixed bottom-24  right-6 lg:w-80 lg:h-96 w-72 h-80
                     bg-[#efeae2] rounded-md shadow-2xl overflow-hidden z-50 transition-all duration-500 flex flex-col ${open
                        ? "opacity-100 translate-y-0 scale-100"
                        : "opacity-0 translate-y-10 scale-95 pointer-events-none"
                    }`}
                style={{
                    // হোয়াটসঅ্যাপের চ্যাট ব্যাকগ্রাউন্ড প্যাটার্ন আর্ট গ্রাফিক্স
                    backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
                    backgroundSize: "contain",
                }}
            >
                {/* হেডার অংশ */}
                <div
                    onClick={() => setOpen(false)}
                    className="bg-[#4AA485] px-4 py-3 flex justify-between items-center cursor-pointer select-none"
                >
                    <div className="flex items-center gap-2">
                        {/* হোয়াটসঅ্যাপ লোগো */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33" viewBox="0 0 32 33" fill="none">
                            <g filter="url(#filter0_f_9477_7201)">
                                <path d="M9.95924 25.2858L10.3674 25.5276C12.0818 26.545 14.0475 27.0833 16.052 27.0842H16.0562C22.2122 27.0842 27.2221 22.0753 27.2247 15.919C27.2258 12.9357 26.0652 10.1303 23.9565 8.01998C22.9223 6.97924 21.6919 6.15397 20.3365 5.59195C18.9812 5.02992 17.5278 4.74231 16.0606 4.74576C9.89989 4.74576 4.88975 9.75407 4.88756 15.91 Kahn C4.88453 18.0121 5.47648 20.0722 6.59498 21.852L6.86071 22.2742L5.73223 26.394L9.95924 25.2858ZM2.50586 29.5857L4.41235 22.6249C3.23657 20.5878 2.618 18.2768 2.61873 15.9091C2.62183 8.50231 8.64941 2.47656 16.0564 2.47656C19.6508 2.47839 23.0245 3.87717 25.5618 6.41629C28.0991 8.95542 29.4952 12.3305 29.4939 15.9199C29.4906 23.3262 23.4621 29.353 16.0562 29.353H16.0504C13.8016 29.3521 11.592 28.788 9.62923 27.7177L2.50586 29.5857Z" fill="#B3B3B3"></path>
                            </g>
                            <path d="M2.36719 29.447L4.27368 22.4862C3.09587 20.4442 2.47721 18.1278 2.48005 15.7705C2.48316 8.36364 8.51074 2.33789 15.9177 2.33789C19.5121 2.33972 22.8859 3.73849 25.4232 6.27762C27.9605 8.81675 29.3565 12.1918 29.3552 15.7812C29.3519 23.1875 23.3234 29.2143 15.9175 29.2143H15.9117C13.663 29.2134 11.4533 28.6493 9.49056 27.5791L2.36719 29.447Z" fill="white"></path>
                            <path d="M15.715 3.84769C9.17146 3.84769 3.85 9.16696 3.84767 15.7051C3.84445 17.9377 4.47318 20.1257 5.66119 22.016L5.94343 22.4646L4.48888 27.2525L9.23469 25.663L9.66824 25.9199C11.4891 27.0005 13.5769 27.5719 15.7061 27.5731H15.7105C22.249 27.5731 27.5705 22.2532 27.573 15.7146C27.5779 14.1562 27.2737 12.6123 26.6778 11.1722C26.082 9.73214 25.2064 8.42458 24.1017 7.3252C23.0032 6.21981 21.6963 5.34329 20.2567 4.74637C18.8171 4.14946 17.2734 3.844 15.715 3.84769Z" fill="#25D366"></path>
                            {/* ফিক্সড: fillRule এবং clipRule */}
                            <path fillRule="evenodd" clipRule="evenodd" d="M12.0858 9.60401C11.8138 9.00922 11.5276 8.99717 11.2692 8.98687L10.5736 8.97852C10.3316 8.97852 9.93846 9.0679 9.60608 9.42544C9.27369 9.78297 8.33594 10.6471 8.33594 12.4046C8.33594 14.1622 9.63628 15.8605 9.81747 16.0991C9.99866 16.3377 12.3277 20.0594 16.0162 21.4913C19.0813 22.6813 19.705 22.4446 20.3706 22.3852C21.0361 22.3257 22.5175 21.521 22.8197 20.6869C23.1219 19.8527 23.1221 19.138 23.0315 18.9886C22.9409 18.8391 22.6989 18.7503 22.3357 18.5716C21.9725 18.3928 20.1888 17.5287 19.8562 17.4094C19.5236 17.2901 19.2818 17.2308 19.0396 17.5883C18.7975 17.9459 18.1029 18.7501 17.8911 18.9886C17.6793 19.227 17.4679 19.2569 17.1047 19.0783C16.7416 18.8998 15.5731 18.5224 14.1867 17.3054C13.108 16.3585 12.3799 15.1892 12.1679 14.8318C11.9559 14.4745 12.1454 14.2809 12.3274 14.1029C12.4902 13.9428 12.6901 13.6858 12.8719 13.4773C13.0537 13.2688 13.1135 13.1197 13.2343 12.8817C13.3551 12.6437 13.2949 12.4346 13.2041 12.256C13.1133 12.0774 12.4083 10.3105 12.0858 9.60401Z" fill="white"></path>
                            <defs>
                                <filter id="filter0_f_9477_7201" x="1.21611" y="1.18682" width="29.5678" height="29.6889" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                                    <feGaussianBlur stdDeviation="0.644873" result="effect1_foregroundBlur_9477_7201"></feGaussianBlur>
                                </filter>
                            </defs>
                        </svg>
                        <span className="text-white font-extralight">Let's chat on WhatsApp</span>
                    </div>
                    {/* ডাউন অ্যারো আইকন */}
                    <svg className="w-5 h-5 text-white stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* চ্যাট বডি / মেসেজ এরিয়া */}
                <div className="p-4  flex flex-col justify-end min-h-40">
                    <div className="bg-white text-gray-800 text-[15px] px-4 pt-2.5 rounded-xl rounded-tl-none shadow-sm max-w-[85%] relative self-start">
                        <p className="leading-relaxed"> আসসালামু আলাইকুম।
                            টপলিশপে আপনাকে স্বাগতম আমি আপনাকে কিভাবে সাহায্য করতে পারি? 🤔</p>
                        <span className="text-[10px] text-gray-400 block text-right mt-1">13:28</span>

                        {/* হোয়াটসঅ্যাপ স্পিচ বাবল অ্যারো */}
                        <div
                            className="absolute -left-2 top-0 w-0 h-0 
                            border-t-0 border-t-transparent 
                            border-r-10 border-r-white 
                            border-b-12 border-b-transparent"
                        ></div>
                    </div>
                </div>

                {/* ইনপুট এবং সেন্ড বাটন এরিয়া */}
                <div className="p-3 bg-transparent flex-1 flex items-end gap-2">
                    <div className="bg-white rounded-full flex items-center px-4 py-2 flex-1 shadow-sm border border-gray-100">
                        {/* ইমোজি আইকন */}
                        <button className="text-gray-400 hover:text-gray-600 mr-2 focus:outline-none">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M12 2C6.47 2 2 6.5 2 12C2 14.6522 3.05357 17.1957 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C14.6522 22 17.1957 20.9464 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM15.5 8C15.8978 8 16.2794 8.15804 16.5607 8.43934C16.842 8.72064 17 9.10218 17 9.5C17 9.89782 16.842 10.2794 16.5607 10.5607C16.2794 10.842 15.8978 11 15.5 11C15.1022 11 14.7206 10.842 14.4393 10.5607C14.158 10.2794 14 9.89782 14 9.5C14 9.10218 14.158 8.72064 14.4393 8.43934C14.7206 8.15804 15.1022 8 15.5 8ZM8.5 8C8.89782 8 9.27936 8.15804 9.56066 8.43934C9.84196 8.72064 10 9.10218 10 9.5C10 9.89782 9.84196 10.2794 9.56066 10.5607C9.27936 10.842 8.89782 11 8.5 11C8.10218 11 7.72064 10.842 7.43934 10.5607C7.15804 10.2794 7 9.89782 7 9.5C7 9.10218 7.15804 8.72064 7.43934 8.43934C7.72064 8.15804 8.10218 8 8.5 8ZM12 17.5C9.67 17.5 7.69 16.04 6.89 14H17.11C16.3 16.04 14.33 17.5 12 17.5Z" fill="#CDD9E2"></path> </svg>
                        </button>
                        {/* টেক্সট ইনপুট ফিল্ড */}
                        <input
                            type="text"
                            placeholder="Write your message..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") window.open(whatsappLink, "_blank");
                            }}
                            className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                        />
                    </div>

                    {/* সেন্ড বাটন (সরাসরি হোয়াটসঅ্যাপে নিয়ে যাবে) */}
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#c6d7e3] hover:bg-[#8bbba9] text-white w-11 h-11 rounded-full flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0"
                    >
                        {/* ফিক্সড: clipPath, strokeWidth, strokeLinecap, strokeLinejoin */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <g clipPath="url(#clip0_9452_6982)">
                                <path d="M18.5703 9.99996L2.66037 17.6603L5.60665 9.99996L2.66037 2.33963L18.5703 9.99996Z" fill="white" stroke="white" strokeWidth="1.6625" strokeLinecap="round" strokeLinejoin="round"></path>
                                <path d="M8.24069 9.99947L3.07723 9.99992" stroke="#C6D7E3" strokeWidth="1.6625" strokeLinecap="round" strokeLinejoin="round"></path>
                            </g>
                            <defs>
                                <clipPath id="clip0_9452_6982">
                                    <rect width="20" height="20" fill="white"></rect>
                                </clipPath>
                            </defs>
                        </svg>
                    </a>
                </div>
            </div>

            {/* ফ্লোটিং গোল বাটন (যা ক্লিক করলে চ্যাট ওপেন হবে) */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed lg:bottom-6 bottom-20 right-6  w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-50"
            >
                {/* ফিক্সড: className, strokeWidth */}
                <svg width="56" height="56" viewBox="0 0 39 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle className="color-element" cx="19.4395" cy="19.4395" r="19.4395" fill="#49E670"></circle>
                    <path d="M12.9821 10.1115C12.7029 10.7767 11.5862 11.442 10.7486 11.575C10.1902 11.7081 9.35269 11.8411 6.84003 10.7767C3.48981 9.44628 1.39593 6.25317 1.25634 6.12012C1.11674 5.85403 2.13001e-06 4.39053 2.13001e-06 2.92702C2.13001e-06 1.46351 0.83755 0.665231 1.11673 0.399139C1.39592 0.133046 1.8147 1.01506e-06 2.23348 1.01506e-06C2.37307 1.01506e-06 2.51267 1.01506e-06 2.65226 1.01506e-06C2.93144 1.01506e-06 3.21063 -2.02219e-06 3.35022 0.532183C3.62941 1.19741 4.32736 2.66092 4.32736 2.79397C4.46696 2.92702 4.46696 3.19311 4.32736 3.32616C4.18777 3.59225 4.18777 3.59224 3.90858 3.85834C3.76899 3.99138 3.6294 4.12443 3.48981 4.39052C3.35022 4.52357 3.21063 4.78966 3.35022 5.05576C3.48981 5.32185 4.18777 6.38622 5.16491 7.18449C6.42125 8.24886 7.39839 8.51496 7.81717 8.78105C8.09636 8.91409 8.37554 8.9141 8.65472 8.648C8.93391 8.38191 9.21309 7.98277 9.49228 7.58363C9.77146 7.31754 10.0507 7.1845 10.3298 7.31754C10.609 7.45059 12.2841 8.11582 12.5633 8.38191C12.8425 8.51496 13.1217 8.648 13.1217 8.78105C13.1217 8.78105 13.1217 9.44628 12.9821 10.1115Z" transform="translate(12.9597 12.9597)" fill="#FAFAFA"></path>
                    <path d="M0.196998 23.295L0.131434 23.4862L0.323216 23.4223L5.52771 21.6875C7.4273 22.8471 9.47325 23.4274 11.6637 23.4274C18.134 23.4274 23.4274 18.134 23.4274 11.6637C23.4274 5.19344 18.134 -0.1 11.6637 -0.1C5.19344 -0.1 -0.1 5.19344 -0.1 11.6637C-0.1 13.9996 0.624492 16.3352 1.93021 18.2398L0.196998 23.295ZM5.87658 19.8847L5.84025 19.8665L5.80154 19.8788L2.78138 20.8398L3.73978 17.9646L3.75932 17.906L3.71562 17.8623L3.43104 17.5777C2.27704 15.8437 1.55796 13.8245 1.55796 11.6637C1.55796 6.03288 6.03288 1.55796 11.6637 1.55796C17.2945 1.55796 21.7695 6.03288 21.7695 11.6637C21.7695 17.2945 17.2945 21.7695 11.6637 21.7695C9.64222 21.7695 7.76778 21.1921 6.18227 20.039L6.17557 20.0342L6.16817 20.0305L5.87658 19.8847Z" transform="translate(7.7758 7.77582)" fill="white" stroke="white" strokeWidth="0.2"></path>
                </svg>
            </button>
        </>
    );
}