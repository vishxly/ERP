const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

//MIDDILWARES
const app = express();
let server = http.createServer(app);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use(cors());
// app.use( 
// 	cors({
// 		origin: ["https://erp-sand.vercel.app"],
// 		methods: ["GET", "POST", "PUT", "DELETE"],
// 		credentials: true,
// 	})
// );
let corsOption = {
	origin:"https://erp-sand.vercel.app",
	methods:"GET,POST,PATCH,PUT,DELETE",
	credentials: true,
}
app.use(cors(corsOption))

const adminRoutes = require("./routes/adminRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const newsRoutes = require("./routes/newsRoutes");
const studentRoutes = require("./routes/studentRoutes");
const dekanRoutes = require("./routes/dekanRoutes");
const loginController = require("./routes/loginRoutes");

//Passport Middleware
app.use(passport.initialize());

//Passport Config.
require("./config/passport")(passport);

app.use(morgan("dev"));

let _response = {};

//ROUTES
app.use("/api", loginController);
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/dekan", dekanRoutes);

// serving the frontend
app.use(express.static(path.join(__dirname, "./dist")));

app.get("*", function (_, res) {
	res.sendFile(path.join(__dirname, "./dist/index.html"), function (err) {
		res.status(500).send(err);
	});
});

//Catching 404 Error
app.use((req, res, next) => {
	const error = new Error("INVALID ROUTE 	NOT WORKING");
	error.status = 404;
	next(error);
});

//Error handler function
app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message,
		},
	});
});

const PORT = process.env.PORT || 5000;

const db = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Db Connected')
    } catch (error) {
        console.log('DB Connection Error');
    }
}

app.use("/", (req, res) => {
	res.status(200).json(_response);
});

server.listen(PORT, () => {
	_response.server = "Healthy";
});
