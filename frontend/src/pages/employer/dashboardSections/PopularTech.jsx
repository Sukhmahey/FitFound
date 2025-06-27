const PopularTech = () => {
    return (
        <div className="container">
            <h4>Popular Technologies (As per interested Candidates)</h4>

            <div className="d-flex justify-content-lg-around flex-wrap gap-6">
                {/* here a bucle */}
                <div className="border">
                    <div><span>97</span></div>
                    <div>
                        <span>“FrontEnd”</span>
                        <span>Candidates</span>
                    </div>
                </div>

                <div className="border">
                    <div><span>97</span></div>
                    <div>
                        <span>“FrontEnd”</span>
                        <span>Candidates</span>
                    </div>
                </div>

                <div className="border">
                    <div><span>97</span></div>
                    <div>
                        <span>“FrontEnd”</span>
                        <span>Candidates</span>
                    </div>
                </div>

                <div className="border">
                    <div><span>97</span></div>
                    <div>
                        <span>“FrontEnd”</span>
                        <span>Candidates</span>
                    </div>
                </div>

                <div className="border">
                    <div><span>97</span></div>
                    <div>
                        <span>“FrontEnd”</span>
                        <span>Candidates</span>
                    </div>
                </div>

                {/* <div>
                    <div>81</div>
                    <div><h3>“BackEnd” Candidates</h3></div>
                </div>

                <div>
                    <div>23</div>
                    <div><h3>“Full Stack” Candidates</h3></div>
                </div>

                <div>
                    <div>51</div>
                    <div><h3>“UI/UX”  Candidates </h3></div>
                </div> */}
            </div>
        </div>
    );

};

export default PopularTech;