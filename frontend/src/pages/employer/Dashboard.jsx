import PopularTech from "./dashboardSections/PopularTech";
import RecentSearch from "./dashboardSections/RecentSearch";

const EmployerDashboard = () => {
  return (
    <div>
      <h1>Employer Dashboard Page</h1>
      <div>
        <RecentSearch></RecentSearch>
        <PopularTech></PopularTech>
      </div>
    </div>
  );
};

export default EmployerDashboard;
