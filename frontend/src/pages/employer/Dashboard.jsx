import PopularTech from "./dashboardSections/PopularTech";
import RecentSearch from "./dashboardSections/RecentSearch";

const EmployerDashboard = () => {
  return (
    <div>
      <div>
        <PopularTech></PopularTech>
        <RecentSearch></RecentSearch>
      </div>
    </div>
  );
};

export default EmployerDashboard;
