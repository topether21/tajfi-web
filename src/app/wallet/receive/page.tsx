import { QRCodeSVG } from 'qrcode.react';
import { Card, CardHeader, CardFooter, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Share } from 'lucide-react';
const ReceivePage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-start h-full p-4 text-white">
            <div className="w-full max-w-md mt-4">
                <Card className="flex flex-col items-center justify-start h-full text-white p-4">
                    <CardHeader className="flex items-center justify-between w-full">
                        <h1 className="text-2xl font-bold">Receive BTC</h1>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <QRCodeSVG
                            value={"bc1pgfnf4v0kn57rr0u9rr39kapjmx6axmuk0zwjjlk907ywmzk9jhkqs5fqtm"}
                            size={200}
                            bgColor={"#1a1a1a"}
                            fgColor={"#ffffff"}
                            level={"L"}
                            imageSettings={{
                                src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWJpdGNvaW4iPjxwYXRoIGQ9Ik0xMS43NjcgMTkuMDg5YzQuOTI0Ljg2OCA2LjE0LTYuMDI1IDEuMjE2LTYuODk0bS0xLjIxNiA2Ljg5NEw1Ljg2IDE4LjA0N201LjkwOCAxLjA0Mi0uMzQ3IDEuOTdtMS41NjMtOC44NjRjNC45MjQuODY5IDYuMTQtNi4wMjUgMS4yMTUtNi44OTNtLTEuMjE1IDYuODkzLTMuOTQtLjY5NG01LjE1NS02LjJMOC4yOSA0LjI2bTUuOTA4IDEuMDQyLjM0OC0xLjk3TTcuNDggMjAuMzY0bDMuMTI2LTE3LjcyNyIvPjwvc3ZnPg==",
                                height: 48,
                                width: 48,
                                excavate: true,
                            }}
                        />
                        <p className="mt-4 text-sm">Bitcoin</p>
                    </CardContent>
                    <CardFooter className="w-full flex flex-col items-center">
                        <div className="bg-gray-600 p-2 rounded flex items-center justify-between">
                            <span className="text-xs">bc1pgfnf4v0kn57rr0u9rr39kapjmx6axmuk0zwjjlk907ywmzk9jhkqs5fqtm</span>
                            <Button variant="ghost" className="text-white">
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="mt-2 text-xs text-center">
                            This address only accepts BTC (Bitcoin), please do not send assets on other networks.
                        </p>
                        <Button className="mt-4 w-full text-foreground">
                            <Share className="mr-2" />
                            Share
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default ReceivePage;
