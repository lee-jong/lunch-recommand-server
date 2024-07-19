import { sendJandiWorkWebhook } from "api/jandi";
import schedule from "node-schedule";
import { sendRecommand } from "controller/recommand";

schedule.scheduleJob("0 20 11 * * 1-5", async () => {
  console.log("schedule job ###");
  await sendRecommand();
});

schedule.scheduleJob("0 0 15 * * 4", async () => {
  console.log("schedule job 주간 보고 시간 ###");

  const info = {
    data: {
      title: "주간 업무 작성 시간이에요.",
      desc: "아래 링크로 접속하여 작성하여주세요.",
      url: "https://docs.google.com/spreadsheets/d/1gxTDNKEkvzw2xdm1l69YKX_rDdbLQtN_4m4BffvQVcc/edit?gid=651537693#gid=651537693",
    },
    key: process.env.WEBHOOK_URL ?? "",
  };
  await sendJandiWorkWebhook(info);
});

schedule.scheduleJob("0 50 9 * * 5", async () => {
  console.log("schedule job 모바일 출근 ###");

  const info = {
    data: {
      title: "모바일 출근 등록 하셨나요?",
      desc: "문제 발생 시, 아래 링크로도 출근 등록이 가능합니다.",
      url: "https://erp.clobot.co.kr/gw/uat/uia/egovLoginUsr.do",
    },
    key: process.env.WEBHOOK_URL ?? "",
  };
  await sendJandiWorkWebhook(info);
});

schedule.scheduleJob("0 0 17 * * 5", async () => {
  console.log("schedule job 모바일 퇴근 ###");

  const info = {
    data: {
      title: "모바일 퇴근 등록 하셨나요?",
      desc: "문제 발생 시, 아래 링크로도 출근 등록이 가능합니다.",
      url: "https://erp.clobot.co.kr/gw/uat/uia/egovLoginUsr.do",
    },
    key: process.env.WEBHOOK_URL ?? "",
  };
  await sendJandiWorkWebhook(info);
});
