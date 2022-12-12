namespace zizo.customer;

entity Customer {
    key bp_number : String @title : '비즈니스 파트너';
        comcode: String @title : '회사코드';
        bp_name: String @title : '비즈니스 파트너 name';
        address : String @title : '주소';
        bp_category : String @title : 'BP 범주';
        

};


