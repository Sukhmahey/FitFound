const SuggestionBoard = () => {
    return (
        <div>
            <p>AI Generated Suggestion Board</p>
            <div>
                <div style={{
                    border: '1px solid #ccc',
                    padding: '16px',
                    margin: '16px',
                    borderRadius: '8px'
                    }}>
                    <div><p>"Profile Updates"</p></div>
                    <div><p>Your profile hasn’t been updated in 3 weeks. Refresh your current role to stay on top of search results.</p></div>
                </div>

                <div style={{
                border: '1px solid #ccc',
                padding: '16px',
                margin: '16px',
                borderRadius: '8px'
                }}>
                    <div><p>"Profile Updates"</p></div>
                    <div><p>Your profile hasn’t been updated in 3 weeks. Refresh your current role to stay on top of search results.</p></div>
                </div>
            </div>
        </div>
    );
};

export default SuggestionBoard;