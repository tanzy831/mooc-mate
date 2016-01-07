#pragma once
#include "db/DataBase.hh"

struct LoginControl
{
    void before(cinatra::Request& req, cinatra::Response& res, cinatra::ContextContainer& /* ctx */)
    {
        if(req.path()  == "/api/save" || req.path() == "/save.html" || req.path() == "/save.pdf")
            return;
        auto body = cinatra::urlencoded_body_parser(req.body());
        if(body.get_val("username") == "")
            res.end(R"({"message": "login first"})");
    }

    void after(cinatra::Request& /* req */, cinatra::Response& /* res */, cinatra::ContextContainer& /*ctx*/)
    {
    }
};
