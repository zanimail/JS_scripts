const { exec } = require('node:child_process');

async function exec_get_stdout(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        resolve(err.message);
        //resolve(stderr);
      }
      resolve(stdout);
    })
  })
}

const envDebug = {  
  CI_JOB_NAME: "CI_JOB_NAME",
  CI_BUILD_REF_NAME: "CI_BUILD_REF_NAME",
  CI_JOB_STATUS: "CI_JOB_STATUS",
  GITLAB_USER_NAME: "GITLAB_USER_NAME",
  CI_COMMIT_SHORT_SHA: "CI_COMMIT_SHORT_SHA",
  CI_COMMIT_AUTHOR: "CI_COMMIT_AUTHOR <email@domain.local>",
  CI_COMMIT_MESSAGE: "CI_COMMIT_MESSAGE",
  CI_PROJECT_URL: "CI_PROJECT_URL",
  CI_PIPELINE_ID: "CI_PIPELINE_ID"
}
const env = { ...envDebug, ...process.env };
/*this source chat bot*/
//const tgmChatId = env.TELEGRAM_CHAT_ID || -4040523415;
//const tgmBotTkn = env.TELEGRAM_BOT_TOKEN || '6902010729:AAG5tktIAjLPLj-VGwMPuP13YRhb_oDAOJo';
//const tgmBotUrl=`https:\/\/httpbin.org/anything/bot${tgmBotTkn}/sendMessage`;  // this is used for debug only

/*this my test chat bot*/
const tgmChatId = env.TELEGRAM_CHAT_ID || -4094914718;
const tgmBotTkn = env.TELEGRAM_BOT_TOKEN || '6752449747:AAGU2flrF-KOT4ibqM14IJeL7mLw4Ph-4Cc';
const tgmBotUrl = `https:\/\/api.telegram.org/bot${tgmBotTkn}/sendMessage`;
(async () => {
  const gitInfo = await exec_get_stdout("git diff HEAD^1.. --stat")  //command from source code
  const tgmMsgTxt = `${env.CI_JOB_NAME}@${env.CI_BUILD_REF_NAME} ${env.CI_JOB_STATUS.toUpperCase()} CI started by 
  ${env.GITLAB_USER_NAME} Commit: ${env.CI_COMMIT_SHORT_SHA} by ${env.CI_COMMIT_AUTHOR.replace(/\s+<\S+>/, '')}  
  ${env.CI_COMMIT_MESSAGE} ${gitInfo} CI URL: ${env.CI_PROJECT_URL}/pipelines/${env.CI_PIPELINE_ID}/`;
  try {
    const response = await fetch(tgmBotUrl, {
      method: "POST",
      headers: {
        accept: 'application/json',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: tgmChatId,
        text: tgmMsgTxt,
        disable_web_page_preview: false,
        disable_notification: false,
        reply_to_message_id: 0
      })
    });
    const result = await response.json();
    console.log('Got the response from TelegramBot: ', JSON.stringify(result));
  } catch (error) {
    console.error('Got error from TelegramBot: ', error);
  }
})();
