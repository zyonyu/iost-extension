import zh_CN from './zh_CN';
import en_US from './en_US';
import kr_KR from './kr_KR';

const chooseLocale = (lan) => {
  switch(lan){
    case 'en':
      return en_US;
    case 'zh':
      return zh_CN;
    case 'ko':
      return kr_KR;
    default:
      return en_US;
  }
}

export default chooseLocale