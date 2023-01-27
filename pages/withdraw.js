import Layout from "../theme/Layout";
import React, { useState, useEffect } from "react";
import {
    Paper,
    Button,
    Grid,
    Typography,
    Box,
    TextField,
    Chip,
    Card,
    CardContent
} from "@mui/material";
import axios from "axios";
import hostname from "../utils/hostname";
import MaterialTableForm from "../components/materialTableForm";
import withAuth from "../routes/withAuth";
import moment from "moment/moment";
import Swal from "sweetalert2";
import LoadingModal from "../theme/LoadingModal";

function withdraw() {
    const [username, setUsername] = useState("");
    const [dataUser, setDataUser] = useState({});
    const [dataCredit, setDataCredit] = useState({});
    const [deposit, setDeposit] = useState([]);
    const [promotion, setPromotion] = useState({});
    const [depositLast, setDepositLast] = useState({});
    const [rowData, setRowData] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChangeData = async (e) => {
        setRowData({ ...rowData, [e.target.name]: e.target.value });
    };

    const searchUser = async () => {
        setLoading(true);

        try {
            let res = await axios({
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("access_token"),
                },
                method: "get",
                url: `${hostname}/api/member_transaction/check-data/${username}`,
            });

            setDeposit(res.data.deposit_latest);
            setDataCredit(res.data.user[0]);
            setDataUser(res.data.info);

            setPromotion(res.data.deposit_latest_one_with_promotion?.promotion);
            setDepositLast(res.data.deposit_latest_one_with_promotion?.deposit_last);
            setLoading(false);
        } catch (error) {
            if (
                error.response.data.error.status_code === 401 &&
                error.response.data.error.message === "Unauthorized"
            ) {
                dispatch(signOut());
                localStorage.clear();
                router.push("/auth/login");
            }
            console.log(error);
        }
    };

    const submitWithdraw = async () => {
        let data = {
            bank_uuid: dataUser.uuid,
            amount: dataCredit.credit,
            bonus_credit: 0,
            username: dataCredit.username,
            annotation: "-",
            bank_time: moment().format("DD/MM hh:mm"),
            create_by: localStorage.getItem("create_by"),
            createdAt: moment().format(),
        }
        console.log('data', data)
        // setLoading(true);
        // try {
        //   if (dataCredit.credit >= rowData.amount) {
        //     let res = await axios({
        //       headers: {
        //         Authorization: "Bearer " + localStorage.getItem("access_token"),
        //       },
        //       method: "post",
        //       url: `${hostname}/api/member_transaction/make-withdraw/`,
        //       data: {
        //         bank_uuid: dataUser.uuid,
        //         amount: dataCredit.credit,
        //         bonus_credit: 0,
        //         username: dataCredit.username,
        //         annotation: "-",
        //         bank_time: moment().format("DD/MM hh:mm"),
        //         create_by: localStorage.getItem("create_by"),
        //         createdAt: moment().format(),
        //       },
        //     });
        //     setLoading(false);
        //     Swal.fire({
        //       position: "center",
        //       icon: "success",
        //       title: "ทำรายการเรียบร้อย",
        //       showConfirmButton: false,
        //       timer: 3000,
        //     });
        //     setRowData({});
        //     setUsername("");
        //   } else if (
        //     rowData.amount === undefined ||
        //     rowData === null ||
        //     rowData === ""
        //   ) {
        //     Swal.fire({
        //       position: "center",
        //       icon: "warning",
        //       title: "กรุณาระบุเครดิตที่ต้องการถอน",
        //       showConfirmButton: false,
        //       timer: 3000,
        //     });
        //   } else {
        //     Swal.fire({
        //       position: "center",
        //       icon: "warning",
        //       title: "ยอดเครดิตไม่เพียงพอ",
        //       showConfirmButton: false,
        //       timer: 2500,
        //     });
        //   }
        // } catch (error) {
        //   console.log(error);
        // }
    };

    const columns = [
        {
            title: "เงินฝาก",
            field: "amount",
            search: true,
            // width: "10%",
            align: "center",
        },
        {
            title: "โบนัส",
            field: "bonus_credit",
            search: true,
            // width: "10%",
            align: "center",
            render: (item) => (
                <Chip
                    label={item.bonus_credit}
                    size="small"
                    style={{
                        background: "#109CF1",
                        color: "#ffff",
                    }}
                />
            ),
        },
        {
            title: "เครดิตก่อนเติม",
            field: "credit_before",
            search: true,
            // width: "10%",
            align: "center",
            render: (item) => (
                <Chip
                    label={item.credit_before}
                    size="small"
                    style={{
                        background: "#FFB946",
                        color: "#ffff",
                    }}
                />
            ),
        },

        {
            title: "เครดิตหลังเติม",
            field: "credit_after",
            search: true,
            // width: "30%",
            align: "center",
            render: (item) => (
                <Chip
                    label={item.credit_after}
                    size="small"
                    style={{
                        background: "#00B900",
                        color: "#ffff",
                    }}
                />
            ),
        },

        {
            title: "เวลา",
            field: "bank_time",
            search: true,
            align: 'center',
            // width: "30%",
            align: "center",
        },
        {
            title: "หมายเหตุ",
            field: "annotation",
            align: 'center',
            search: true,
            // width: "30%",
            align: "center",
        },
        { title: "Ref", field: "ref", search: true, width: "10%", align: "center" },
    ];

    useEffect(() => { }, [rowData.amount]);

    return (
        <Layout>
            <Paper sx={{ mb: 5, p: 3 }}>
                <Typography
                    sx={{
                        fontSize: "24px",
                        textDecoration: "underline #41A3E3 3px",
                    }}
                >
                    สร้างรายการถอน
                </Typography>
            </Paper>
            <Grid container spacing={3}>
                <Grid item xs={8}>
                    <Paper>
                        <Grid container sx={{ textAlign: "center" }} spacing={3}>
                            <Grid item xs={3}>
                                <Typography variant="h6" sx={{ mb: 2, textAlign: "right" }}>
                                    Username :{" "}
                                </Typography>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    name="username"
                                    type="text"
                                    fullWidth
                                    value={username || ""}
                                    size="small"
                                    onChange={(e) => setUsername(e.target.value)}
                                    variant="outlined"
                                />{" "}
                            </Grid>
                            <Grid item xs={3}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => searchUser()}
                                >
                                    <Typography sx={{ color: '#ffff' }}>ค้นหา</Typography>

                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6}>
                                <Box sx={{ p: 5 }}>
                                    <Typography>ชื่อ-สกุล</Typography>
                                    <TextField
                                        name="username"
                                        type="text"
                                        fullWidth
                                        value={dataUser.bank_account_name || ""}
                                        size="small"
                                        onChange={(e) => handleChangeData(e)}
                                        variant="outlined"
                                        sx={{ mb: 3 }}
                                        disabled
                                    />{" "}
                                    <Typography>ธนาคาร</Typography>
                                    <TextField
                                        name="bank_name"
                                        type="text"
                                        fullWidth
                                        value={dataUser.bank_name || ""}
                                        size="small"
                                        onChange={(e) => handleChangeData(e)}
                                        variant="outlined"
                                        sx={{ mb: 3 }}
                                        disabled
                                    />{" "}
                                    <Typography>เครดิตปัจจุบัน</Typography>
                                    <TextField
                                        name="credit"
                                        type="text"
                                        fullWidth
                                        value={dataCredit.credit || "ไม่มีเครดิต"}
                                        size="small"
                                        onChange={(e) => handleChangeData(e)}
                                        variant="outlined"
                                        sx={{ mb: 3 }}
                                        disabled
                                    />{" "}
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ p: 5 }}>
                                    <Typography>หมายเลขโทรศัพท์</Typography>
                                    <TextField
                                        name="tel"
                                        type="text"
                                        fullWidth
                                        value={dataUser.tel || ""}
                                        size="small"
                                        onChange={(e) => handleChangeData(e)}
                                        variant="outlined"
                                        sx={{ mb: 3 }}
                                        disabled
                                    />{" "}
                                    <Typography>เลขบัญชี</Typography>
                                    <TextField
                                        name="bank_number"
                                        type="text"
                                        fullWidth
                                        value={dataUser.bank_number || ""}
                                        size="small"
                                        onChange={(e) => handleChangeData(e)}
                                        variant="outlined"
                                        sx={{ mb: 3 }}
                                        disabled
                                    />{" "}
                                    <Typography>จำนวนเงินที่จะถอน</Typography>
                                    <TextField
                                        name="amount"
                                        type="text"
                                        fullWidth
                                        value={dataCredit.credit || "ไม่มีเครดิต"}
                                        size="small"
                                        onChange={(e) => handleChangeData(e)}
                                        variant="outlined"
                                        sx={{ mb: 3 }}
                                        disabled
                                    />{" "}
                                    <Box sx={{ textAlign: "right" }}>
                                        <Button
                                            variant="contained"
                                            onClick={() => submitWithdraw()}
                                        >
                                            <Typography sx={{ color: '#ffff' }}>ยืนยันทำรายการ</Typography>

                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper>

                    </Paper>
                    <Card fullWidth
                        sx={{
                            bgcolor: "#101D35",
                        }}
                    >
                        <CardContent>
                            <Typography component="div" sx={{ color: "#eee" }}>
                                Turn Type
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{ textAlign: "center", color: "#41A3E3" }}
                            >100
                                {/* {Intl.NumberFormat("TH").format(parseInt(report.sumAmountAll))} */}
                            </Typography>
                            <Typography
                                component="div"
                                sx={{ color: "#eee", textAlign: "right" }}
                            >
                                บาท
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card fullWidth
                        sx={{
                            mt: 4,
                            bgcolor: "#101D35",
                        }}
                    >
                        <CardContent>
                            <Typography component="div" sx={{ color: "#eee" }}>
                                ยอดเครดิตที่ต้องทำ
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{ textAlign: "center", color: "#41A3E3" }}
                            >100
                                {/* {Intl.NumberFormat("TH").format(parseInt(report.sumAmountAll))} */}
                            </Typography>
                            <Typography
                                component="div"
                                sx={{ color: "#eee", textAlign: "right" }}
                            >
                                บาท
                            </Typography>
                        </CardContent>
                    </Card>
                    <Card fullWidth
                        sx={{
                            mt: 3,
                            bgcolor: "#101D35",
                        }}
                    >
                        <CardContent>
                            <Typography component="div" sx={{ color: "#eee" }}>
                                Total
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{ textAlign: "center", color: "#41A3E3" }}
                            >100
                                {/* {Intl.NumberFormat("TH").format(parseInt(report.sumAmountAll))} */}
                            </Typography>
                            <Typography
                                component="div"
                                sx={{ color: "#eee", textAlign: "right", }}
                            >
                                บาท
                            </Typography>
                        </CardContent>
                    </Card>

                </Grid>
            </Grid>

            <Grid style={{ marginTop: "20px" }}>
                <MaterialTableForm pageSize={10} data={deposit} columns={columns} />
            </Grid>
            <LoadingModal open={loading} />
        </Layout>
    );
}

export default withdraw;