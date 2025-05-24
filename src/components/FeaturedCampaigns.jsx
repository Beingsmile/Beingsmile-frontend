import Campaign from "./Campaign";
import campaign1 from "../assets/hero.jpg";
import { FaArrowRight } from "react-icons/fa";

const campaignData = [
  {
    image: campaign1,
    title: "Help Build a School in Rural Bangladesh",
    author: "Fatima Noor",
    initials: "FN",
    raised: 18450,
    goal: 25000,
    daysLeft: 10,
    supporters: 1214,
  },
  {
    image: campaign1,
    title: "Urgent Surgery Needed for Baby Anan",
    author: "Rahman Tuhin",
    initials: "RT",
    raised: 31400,
    goal: 40000,
    daysLeft: 5,
    supporters: 2290,
  },
  {
    image: campaign1,
    title: "Support Flood Relief for Families in Sylhet",
    author: "Hasina Ahmed",
    initials: "HA",
    raised: 12200,
    goal: 20000,
    daysLeft: 7,
    supporters: 874,
  },
];

const FeaturedCampaigns = () => {
  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 dark:text-white">
        Featured{" "}
        <span className="text-blue-600 dark:text-blue-400">Campaigns</span>
      </h2>
      <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-8 md:mb-12 ">
        Discover ongoing fundraisers you can support to make a real difference.
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {campaignData.map((campaign, idx) => (
          <Campaign key={idx} {...campaign} />
        ))}
      </div>
      {/* View All Button */}
      <div className="mt-10 text-center group">
        <a
          href="/campaigns"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm sm:text-base font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700 transition"
        >
          View All Campaigns
          <FaArrowRight className="text-white text-sm sm:text-base group-hover:translate-x-1 transition-all duration-300" />
        </a>
      </div>
    </section>
  );
};

export default FeaturedCampaigns;
