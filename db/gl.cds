namespace zizo.gl;

entity Gl {
    key gl_external_id      : String @title: 'GL 계정 외부 ID';
        create_date         : String @title: '생성날짜';
        history             : String @title: '내역';
        CoA                 : String @title: '계정과목표';
        gl_account_type     : String @title: 'GL 계정 유형';
        accont_group        : String @title: '계정 그룹';
        gl_affliation_num   : String @title: '관계사 번호';
        description         : String @title: 'GL 계정 설명';
        functional_area     : String @title: '기능 영역';
        gl_account          : String @title: 'GL 계정';
        pl_account_type     : String @title: '손익계산서 계정 유형';
        account_group_num   : String @title: '그룹 계정 번호';
        meaning             : String @title: '의미';
        gl_comcode          : String @title: '회사코드';
        opendata            : Boolean @title: '미결항목 여부';
        revenue             : Integer @title: '수익';
        version             : String @title: '재무제표버전';
        version_name        : String @title: '재무제표버전 이름';
        language            : String @title: '언어';
        CoA_name            : String @title : '계정과목표 이름';
    
        
};

