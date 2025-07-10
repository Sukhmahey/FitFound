import AppearanceIn from "./insightsSections/AppearanceIn";
import ProfileVisibility from "./insightsSections/ProfileVisibility";
import RecommendedActions from "./insightsSections/RecommendedActions";
import SuggestionBoard from "./insightsSections/SuggestionBoard";


const Insights = () => {
    return (
        <div>
            <ProfileVisibility></ProfileVisibility>
            <RecommendedActions></RecommendedActions>
            <SuggestionBoard></SuggestionBoard>
            <AppearanceIn></AppearanceIn>
        </div>
    );

};

export default Insights;