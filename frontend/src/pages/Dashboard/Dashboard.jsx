import { Card, CardContent, Typography } from "@mui/material";


const Dashboard = () => {

  return (
    <>
      <Card>
          <CardContent>
            <Typography variant="h5" component="h3" fontWeight={600}>
              Dashboard
            </Typography>
            <Typography variant="subtitle2" component="h6" color="textSecondary">
              Dashboard 
            </Typography>
          </CardContent>
        </Card>
        <br />
        {/* <div className="main d-flex">          */}
          {/* <div className="right-content w-100"> */}
            <div className="row dashboardBoxWrapperRow">
              <div className="col-md-8">
                <div className="dashboardBoxWrapper d-flex">
                  <div className="dashboardBox"></div>

                  <div className="dashboardBox"></div>
                  <div className="dashboardBox"></div>

                  <div className="dashboardBox"></div>
                </div>
              </div>
              <div className="col-md-4 pl-0">
                <div className="box"></div>
              </div>
            </div>
          {/* </div> */}
        {/* </div> */}
      
    </>
  );
};

export default Dashboard;

