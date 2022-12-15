namespace zizo.companycode;

entity Companycode {
    key comcode     : String @title: '회사 코드';
        COarea      : String @title: '관리회계 영역';
        comname     : String @title: '회사 이름';
        currency    : String @title: '계정 통화';
        CoA         : String @title: '계정과목표';
};

