import AppearanceIn from "./insightsSections/AppearanceIn";
import ProfileVisibility from "./insightsSections/ProfileVisibility";
// import RecommendedActions from "./insightsSections/RecommendedActions";
// import SuggestionBoard from "./insightsSections/SuggestionBoard";


const Insights = () => {
    return (
        <div>
            <ProfileVisibility></ProfileVisibility>
            <AppearanceIn></AppearanceIn>
            {
            
            /* 
            
            <RecommendedActions></RecommendedActions>
            <SuggestionBoard></SuggestionBoard> */}
        </div>
    );

};

export default Insights;