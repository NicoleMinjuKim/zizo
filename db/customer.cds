namespace zizo.customer;

entity Customer {
    key bp_number                : String  @title : '비즈니스 파트너';
        comcode                  : String  @title : '회사코드';
        bp_name                  : String  @title : '비즈니스 파트너 이름';
        address                  : String  @title : '도로 주소';
        house_num                : String  @title : '번지';
        potal_code               : String  @title : '우편번호';
        city                     : String  @title : '도시';
        country                  : String  @title : '국가/지역';
        region                   : String  @title : '지역';
        bp_category              : String  @title : 'BP 범주';
        gendercall               : String  @title : '개인 칭호';
        first_name               : String  @title : '이름';
        last_name                : String  @title : '성';
        gender                   : String  @title : '성별';
        org                      : String  @title : '조직명칭';
        authority_group          : String  @title : '권한그룹';
        birthday                 : String  @title : '생년월일';
        affliation_com_num       : String  @title : '관계사 번호';
        create_person            : String  @title : '생성자';
        create_date              : String  @title : '생성일';
        final_changer            : String  @title : '최종 변경자';
        final_change_date        : String  @title : '최종 변경일';
        customer_group           : String  @title : '고객 계정 그룹';
        cust_authority_group     : String  @title : '고객 권한 그룹';
        deliverydate_rule        : String  @title : '납품일 규칙';
        group_key                : String  @title : '그룹 키';
        supplier                 : String  @title : '공급업체';
        proxy_payer              : String  @title : '대리 지급인';
        payment_reason           : String  @title : '지급 사유';
        holdorder                : Boolean @title : '오더 보류';
        holdclaim                : Boolean @title : '청구 보류';
        holddelivery             : Boolean @title : '납품 보류';
        holdposting              : Boolean @title : '전기 보류';
        classify_cust            : String  @title : '고객 분류';
        vat_duty                 : Boolean @title : 'VAT 납세 의무';
        postoffice_postal_number : String  @title : '우체국 우편번호';
        legal_state              : String  @title : '법적 형태';
        foundation_day           : String  @title : '설립일';
        liquidation_day          : String  @title : '청산일';
        

};


